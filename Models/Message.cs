namespace ChatotTrainingCamp.Models
{
    public class Message
    {
        public bool FromServer { get; set; }
        public string PlayerName { get; set; }
        public string Content { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
    }
}
