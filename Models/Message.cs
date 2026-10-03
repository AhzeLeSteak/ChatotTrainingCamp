namespace ChatotTrainingCamp.Models;

public class Message
{
    public bool FromServer { get; set; } = false;
    public string PlayerName { get; set; }
    public required string Content { get; set; }
    public DateTime Date { get; set; } = DateTime.UtcNow;
    public ChatColor? Color { get; set; }
}

public enum ChatColor
{
    Greyish,
    Blue,
    Green,
    Yellow,
    Red
}