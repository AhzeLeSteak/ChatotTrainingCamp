using ChatotTrainingCamp.Models;

namespace ChatotTrainingCamp.Services
{
    public static class RandomService
    {

        private static Random rng = new Random();


        public static string GenerateRoomCode(List<Room> rooms, int roomCodeLength = 5)
        {
            const string candaidateChars = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789";

            bool valid = false;
            string code = "";

            while (!valid)
            {
                code = "";
                for (int i = 0; i < roomCodeLength; i++)
                    code += candaidateChars[rng.Next(candaidateChars.Length)];
                valid = !rooms.Any(r => r.Code == code);
            }
            return code;
        }

        public static List<T> GetNRandomElementsFromList<T>(List<T> list, int N)
        {
            if (N > list.Count) throw new ArgumentException($"Can not take {N} random elements from a list of size {list.Count}");
            List<T> result = new List<T>();
            for(int i = 0; i < N; i++)
            {
                T newElem;
                do
                {
                    newElem = RandomElementFromList(list);
                } while (result.Contains(newElem));
                result.Add(newElem);
            }
            return result;
        }

        public static T RandomElementFromList<T>(List<T> list) {
            return list[rng.Next(list.Count)];
        }

    }
}
