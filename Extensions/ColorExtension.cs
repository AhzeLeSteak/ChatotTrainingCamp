using Aspose.Svg.Drawing;

namespace ChatotTrainingCamp.Extensions;

public static class ColorExtension
{
    public static Color ToBetterColor(this System.Drawing.Color color) =>
        Color.FromRgb(color.R, color.G, color.B);
    
    public static float GetHue(this System.Drawing.Color color) =>
        color.ToBetterColor().GetHue();
    
    public static System.Drawing.Color ToBaseColor(this Color color) =>
        System.Drawing.Color.FromArgb((int)(color.Alpha * 255), (int)(color.Red * 255), (int)(color.Green * 255), (int)(color.Blue * 255));
}