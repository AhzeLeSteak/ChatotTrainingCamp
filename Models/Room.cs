﻿using ChatotTrainingCamp.Services;

namespace ChatotTrainingCamp.Models
{

    public enum RoomStatus
    {
        Waiting,
        Playing,
        BeetweenRounds,
        Scores,
    }


    public class Room
    {
        public string Code { get; set; }
        public RoomStatus Status { get; set; } = RoomStatus.Waiting;
        public List<Player> Players { get; set; } = new();
        public List<Message> Messages { get; set; } = new();
        public RoomParams Params { get; set; } = new();
        public List<Question> Questions { get; set; } = new();
        public int QuestionIndex { get; set; } = -1;

        public Question? CurrentQuestion => this.Status == RoomStatus.Waiting || this.Status == RoomStatus.Scores
            ? null 
            : this.Questions[this.QuestionIndex];
        public bool IsOver => this.QuestionIndex == this.Questions.Count;

        public Room(string code)
        {
            Code = code;
        }

        public void Reset() {
            this.QuestionIndex = -1;
            this.Status = RoomStatus.Waiting;

            var pool = Params.GetPokemonPool();
            var pouet = RandomService.GetNRandomElementsFromList(pool, this.Params.NbRounds * 4);
            for(int i = 0; i < Params.NbRounds; i++)
            {
                this.Questions.Add(new Question(pouet.Slice(i*4, 4)));
            }
            this.Players = this.Players.Where(p => p.Connected).ToList();
            foreach(var player  in this.Players)
            {
                player.Answers = new Answer[this.Params.NbRounds];
                player.Points = 0;
            }
        }

        public void NextQuestion()
        {
            if(this.QuestionIndex >= 0)
                this.CalcPoints();

            this.QuestionIndex++;
            this.Players.ForEach(p => p.Emotion = Emotion.Normal);
            if (this.IsOver)
                this.Status = RoomStatus.Scores;
            else
            {
                this.Status = RoomStatus.Playing;
                this.CurrentQuestion!.StartDate = DateTime.UtcNow;
            }
        }

        private void CalcPoints()
        {
            var maxPoints = (Players.Count + 1) * 100;
            var correctAnswer = CurrentQuestion!.Answer;
            this.Players.Where(p => p.Answers[QuestionIndex].PkId == correctAnswer)
                .OrderBy(p => p.Answers[QuestionIndex].TimeInMs)
                .ToList()
                .ForEach(p =>
                {
                    p.Points += maxPoints;
                    maxPoints -= 100;
                });

        }
    }
}
