using ChatotTrainingCamp.Models;
using Microsoft.AspNetCore.SignalR;


namespace ChatotTrainingCamp.Services
{
    public class RoomHub: Hub
    {
        const string ROOM_CODE = "room_code";
        const string PLAYER = "player";

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
            HubContext= hubContext;
        }


        #region Create/join room management
        public async Task<Room> CreateRoom(string playerName)
        {
            var room = new Room(RandomService.GenerateRoomCode(rooms.Values.ToList()));
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
            else
            {
                CurrentPlayer = new Player()
                {
                    Name = playerName,
                    ConnectionId = Context.ConnectionId,
                    ProfilePicture = 2
                };
                CurrentRoom.Players.Add(CurrentPlayer);
            }
            Console.WriteLine($"Player {CurrentPlayer.Name} {(rejoin ? "re" : "")}joined room {CurrentRoom.Code}");
            await Groups.AddToGroupAsync(CurrentPlayer.ConnectionId, roomCode);
            return CurrentRoom;
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
#if !DEBUG
                if (CurrentRoom.Status == RoomStatus.Waiting)
                {
                    CurrentRoom.Players.Remove(CurrentPlayer);
                    if (CurrentRoom.Players.Count == 0)
                        rooms.Remove(CurrentRoom.Code);
                }
                else
#endif
                    CurrentPlayer.Connected = false;
                Console.WriteLine($"Player {CurrentPlayer.Name} exited room {CurrentRoom.Code}");
                await UpdateRoom();
            }
            Context.Items.Clear();
            await base.OnDisconnectedAsync(exception);
        }
        #endregion

        #region Room lobby
        public async Task ChangePP(int pp)
        {
            CurrentPlayer.ProfilePicture = pp;
            await UpdateRoom();
        }

        public async Task SendMessage(string message)
        {
            CurrentRoom.Messages.Insert(0, new Message()
            {
                PlayerName = CurrentPlayer.Name,
                Content = message
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
                new Thread(new ThreadStart(() => GoToNextQuestionIfNeeded(room))).Start();
        }

        private async void GoToNextQuestionIfNeeded(Room room)
        {
            var questionIndex = room.QuestionIndex;
            await Task.Delay(room.Params.RoundDurationSeconds * 1000);
            if (room.QuestionIndex == questionIndex && room.Status == RoomStatus.Playing)
                await NextQuestion(room);
        }

        #endregion


    }
}
