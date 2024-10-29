namespace Crymon.Models
{
    public class Player
    {
        public bool IsCreator { get; set; }
        public string Name { get; set; }
        public bool Connected { get; set; } = true;
        public string ConnectionId { get; set; }

        public int[] Answers { get; set; }


        public int ProfilePicture { get; set; }
        public Emotion Emotion { get; set; } = Emotion.Normal;

    }

    public enum Emotion
    {
        Normal
    }
}
