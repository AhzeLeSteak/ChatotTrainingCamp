namespace ChatotTrainingCamp.Models;

public enum GameMode
{
    Cry,
    Silhouette
}

public class RoomParams
{
    public int NbRounds { get; set; } = 10;
    public List<int> Generations { get; set; } = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    public int RoundDurationSeconds { get; set; } = 15;
    
    public GameMode GameMode { get; set; } = GameMode.Cry;

    public List<int> GetPokemonPool()
    {
        int[] pokemonPerGeneration = [151, 100, 135, 107, 156, 72, 88, 96, 120];
        List<int> pool = new();
        foreach(var generation in Generations)
        {
            var generationIndex = generation - 1;
            var startIndex = pokemonPerGeneration.ToList().Slice(0, generationIndex).Sum() + 1;
            pool.AddRange(Enumerable.Range(startIndex, pokemonPerGeneration[generationIndex]));
        }
        return pool;
    }
}