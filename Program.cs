using System.Drawing;
using System.Drawing.Imaging;
using ChatotTrainingCamp.Extensions;
using ChatotTrainingCamp.Services;
using Color = System.Drawing.Color;

var og = new Bitmap("test/gardevoir.png");
var shiny = new Bitmap("test/gardevoir_shiny.png");

if (og.Width != shiny.Width || og.Height != shiny.Height)
    throw new Exception("Og image and shiny have different dimension");

void MakeFakeShiny(int i, float hueShift)
{
    var newImg = new Bitmap(og.Width, og.Height);

    for (int x = 0; x < og.Width; x++)
    {
        for (int y = 0; y < og.Height; y++)
        {
            var ogPixel = og.GetPixel(x, y);
            if (og.GetPixel(x, y).A == 0)
            {
                newImg.SetPixel(x, y, Color.Transparent);
                continue;
            }
            var shinyPixel = shiny.GetPixel(x, y);
            if (ogPixel.Equals(shinyPixel))
            {
                newImg.SetPixel(x, y, ogPixel);
                continue;
            }
        
            var ogHue = og.GetPixel(x, y).ToBetterColor().GetHue();
            var shinyHue = shiny.GetPixel(x, y).ToBetterColor().GetHue();
        
            var difference = ogHue - shinyHue;
            difference *= hueShift;
            var newColor = ogPixel
                .ToBetterColor()
                .WithHue((ogHue - difference) % 360f)
                .ToBaseColor();
            newImg.SetPixel(x, y, newColor);
        } 
    }

    newImg.Save($"test/output_{i}.bmp");
}

var mostRepresentedColorInOg = Enumerable.Range(0, og.Width)
    .SelectMany(x => Enumerable.Range(0, og.Height).Select(y => (x, y)))
    .Select(coord => og.GetPixel(coord.x, coord.y))
    .GroupBy(pixel => pixel)
    .OrderByDescending(group => group.Count())
    .First()
    .Key;

for (int i = 0; i < 4; i++)
    MakeFakeShiny(i, 45f * (i+1));

return;


var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddControllers();
#if DEBUG
builder.Services.AddCors(options =>
{
    options.AddPolicy("oui", policy =>
                      {
                          policy
                          .WithOrigins("http://localhost:4200")
                          .AllowAnyHeader()
                          .AllowAnyMethod()
                          .AllowCredentials();
                      });
});
#endif
builder.Services.AddSignalR();
builder.Services.AddHttpClient();


var app = builder.Build();

app.MapGet("/test/{id:int}", async (int id, IHttpClientFactory factory) =>
{
    var link = "https://img.pokemondb.net/sprites/home/normal/tepig.png";
    var shiny_link = "https://img.pokemondb.net/sprites/home/shiny/tepig.png";
    using var client = factory.CreateClient();
    var response = await client.GetAsync(link);
    response.EnsureSuccessStatusCode();
    await using var inputStream = await response.Content.ReadAsStreamAsync();
    var bitmapImage = new Bitmap(inputStream);
    MemoryStream ms = new MemoryStream();
    bitmapImage.Save(ms, ImageFormat.Jpeg);
    byte[] byteImage = ms.ToArray();
    return Convert.ToBase64String(byteImage);
});


app.MapHub<RoomHub>("/room");

#if DEBUG
app.UseCors("oui");
#endif

app.Run();
