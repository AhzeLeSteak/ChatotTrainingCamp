namespace ChatotTrainingCamp.Models
{
    public class RoomParams
    {
        public int NbRounds { get; set; } = 10;
        public List<int> Generations { get; set; } = new() { 1, 2, 3, 4, 5, 6, 7, 8, 9};
        public int RoundDurationSeconds { get; set; } = 10;

        public List<int> GetPokemonPool()
        {
            int[] pokemonPerGeneration = { 151, 100, 135, 107, 156, 72, 88, 96, 120 };
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
}
