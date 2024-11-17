using ChatotTrainingCamp.Models;
using Microsoft.AspNetCore.SignalR;


namespace ChatotTrainingCamp.Services
{
    public class RoomHub: Hub
    {
        const string ROOM_CODE = "room_code";
        const string PLAYER = "player";
        private static SemaphoreSlim roomSemaphore = new(1, 1);

        private static Dictionary<string, Room> rooms = new();
        private Player CurrentPlayer
        {
            get => Context.Items[PLAYER] as Player;
            set => Context.Items[PLAYER] = value;
        }
        private string CurrentRoomCode => Context.Items[ROOM_CODE] as string;
        private Room CurrentRoom => rooms[CurrentRoomCode];

        private IHubContext<RoomHub> HubContext;

        public RoomHub(IHubContext<RoomHub> hubContext) {
            HubContext = hubContext;
        }


        #region Create/join room management
        public async Task<Room> CreateRoom(string playerName){
            await roomSemaphore.WaitAsync();
            var room = new Room(RandomService.GenerateRoomCode(rooms.Values.ToList()));
            roomSemaphore.Release();
            rooms.Add(room.Code, room);
            await JoinRoom(room.Code, playerName);
            CurrentPlayer.IsCreator = true;
            return CurrentRoom;
        }

        public async Task<Room?> JoinRoom(string roomCode, string playerName, bool rejoin = false)
        {
            if(!rooms.ContainsKey(roomCode))
                return null;
            Context.Items[ROOM_CODE] = roomCode;
            if (rejoin)
            {
                var player = CurrentRoom.Players.Find(p => p.Name == playerName);
                if (player == null)
                    return null;
                player.ConnectionId = Context.ConnectionId;
                player.Connected = true;
                CurrentPlayer = player;
            }
            else{
                await CurrentRoom.Semaphore.WaitAsync();
                CurrentPlayer = new Player()
                {
                    Name = playerName,
                    ConnectionId = Context.ConnectionId,
                    ProfilePicture = RandomService.GetRandomPP(CurrentRoom)
                };
                CurrentRoom.Players.Add(CurrentPlayer);
                CurrentRoom.Messages.Add(new Message()
                {
                    Content = $"{playerName} joined the room",
                    FromServer = true,
                });
                CurrentRoom.Semaphore.Release();
            }
#if DEBUG
            Console.WriteLine($"Player {CurrentPlayer.Name} {(rejoin ? "re" : "")}joined room {CurrentRoom.Code}");
#endif
            await Groups.AddToGroupAsync(CurrentPlayer.ConnectionId, roomCode);
            await UpdateRoom(CurrentRoom);
            return CurrentRoom;
        }

        public async Task Quit(){
            var room = CurrentRoom;
            var player = CurrentPlayer;
            Context.Items.Clear();

            room.Players.Remove(player);
            if (room.Players.Any())
            {
                room.Players[0].IsCreator = true;
                room.Messages.Add(new Message
                {
                    FromServer = true,
                    Content = $"{player.Name} left the room"
                });
                await UpdateRoom(room);
            }
            else
                rooms.Remove(room.Code);
        }


        public async Task UpdateRoom(Room? room= null)
        {
            room ??= CurrentRoom;
            var tasks = room.Players.Select(player => HubContext.Clients.Client(player.ConnectionId).SendCoreAsync("UpdateRoom", [room]));
            await Task.WhenAll(tasks);
            //await Clients.Groups(roomCode ?? CurrentRoomCode).SendCoreAsync("UpdateRoom", [CurrentRoom]);
        }


        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            if (CurrentPlayer != null)
            {
                if (CurrentRoom.Status == RoomStatus.Waiting){
                    await Quit();
                }
                else
                    CurrentPlayer.Connected = false;
                await UpdateRoom();
            }
            Context.Items.Clear();
            await base.OnDisconnectedAsync(exception);
        }
        #endregion

        #region Room lobby
        public async Task ChangePP(int pp){
            await CurrentRoom.Semaphore.WaitAsync();
            if(!CurrentRoom.Players.Any(p => p.ProfilePicture == pp))
                CurrentPlayer.ProfilePicture = pp;
            CurrentRoom.Semaphore.Release();
            await UpdateRoom();
        }

        public async Task SendMessage(string message)
        {
            CurrentRoom.Messages.Insert(0, new Message()
            {
                PlayerName = CurrentPlayer.Name,
                Content = message,
                FromServer = false,
            });
            await UpdateRoom();
        }

        public async Task UpdateParam(RoomParams param)
        {
            CurrentRoom.Params = param;
            await UpdateRoom();
        }

        #endregion

        #region Game management
    
        public async Task StartRoom()
        {
            CurrentRoom.Reset();
            await NextQuestion();
        }

        public async Task Replay()
        {
            CurrentRoom.Reset();
            await UpdateRoom();
        }

        public async Task Answer(int pkid, int timeInMs)
        {
            Room currentRoom = CurrentRoom;
            var questionId = currentRoom.QuestionIndex;
            if (CurrentPlayer.Answers[questionId] != null) return;
            CurrentPlayer.Answer(currentRoom.QuestionIndex, pkid, timeInMs);
            CurrentPlayer.Emotion = pkid == currentRoom.CurrentQuestion!.Answer ? Emotion.Happy : Emotion.Sad;
            if (currentRoom.Players.All(player => !player.Connected || player.Answers[questionId] != null))
                NextQuestion(currentRoom);
            else
                UpdateRoom(currentRoom);
        }

        private async Task NextQuestion(Room? room = null)
        {
            room ??= CurrentRoom;
            if (room.QuestionIndex >= 0)
            {
                room.Status = RoomStatus.BeetweenRounds;
                await UpdateRoom(room);
                await Task.Delay(2000);
            }
            room.NextQuestion();
            await UpdateRoom(room);
            if(!room.IsOver)
                new Thread(() => GoToNextQuestionIfNeeded(room)).Start();
        }

        private async void GoToNextQuestionIfNeeded(Room room)
        {
            var questionIndex = room.QuestionIndex;
            await Task.Delay(room.Params.RoundDurationSeconds * 1000);
            await room.Semaphore.WaitAsync();
#if !DEBUG
            if (room.QuestionIndex == questionIndex && room.Status == RoomStatus.Playing)
                await NextQuestion(room);
#endif
            room.Semaphore.Release();
        }

        #endregion


    }
}
