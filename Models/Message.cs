namespace ChatotTrainingCamp.Models
{
    public class Message
    {
        public string PlayerName { get; set; }
        public string Content { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
    }
}
