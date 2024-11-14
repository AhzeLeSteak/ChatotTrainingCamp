using ChatotTrainingCamp.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
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


var app = builder.Build();

// Configure the HTTP request pipeline.
/*if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}*/

//app.UseAuthorization();

app.MapHub<RoomHub>("/room");

#if DEBUG
app.UseCors("oui");
#endif

app.Run();
