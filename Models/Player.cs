namespace ChatotTrainingCamp.Models
{
    public class Player
    {
        public bool IsCreator { get; set; }
        public string Name { get; set; }
        public bool Connected { get; set; } = true;
        public string ConnectionId { get; set; }

        public Answer[] Answers;
        public int Points { get; set; } = 0;


        public int ProfilePicture { get; set; }
        public Emotion Emotion { get; set; } = Emotion.Normal;


        public void Answer(int questionId, int pkid, int timeinms)
        {
            this.Answers[questionId] = new Answer()
            {
                PkId = pkid,
                TimeInMs = timeinms,
            };
        }

    }

    public enum Emotion
    {
        Angry,
        Crying,
        Determined,
        Dizzy,
        Happy,
        Inspired,
        Joyous,
        Normal,
        Pain,
        Sad,
        Shouting,
        Sigh,
        Stunned,
        Surprised,
        TearyEyed,
        Worried
    }
}
