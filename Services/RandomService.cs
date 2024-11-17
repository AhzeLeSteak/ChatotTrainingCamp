using ChatotTrainingCamp.Models;

namespace ChatotTrainingCamp.Services
{
    public static class RandomService
    {

        private static Random rng = new();

        private static List<int> PPs = new()
        {
            1,
            2,
            3,
            4,
            5,
            6,
            7,
            8,
            9,
            152,
            153,
            154,
            155,
            156,
            157,
            158,
            159,
            160,
            252,
            253,
            254,
            255,
            256,
            257,
            258,
            259,
            260,
            387,
            388,
            389,
            390,
            391,
            392,
            393,
            394,
            395,
            495,
            496,
            497,
            498,
            499,
            500,
            501,
            502,
            503
        };

        public static int GetRandomPP(Room room){
            var pp = 0;
            do{
                pp = GetNRandomElementsFromList(PPs).First();
            } while (room.Players.Any(p => p.ProfilePicture == pp));
            return pp;
        }


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

        public static List<T> GetNRandomElementsFromList<T>(List<T> list, int n = 1)
        {
            if (n > list.Count) throw new ArgumentException($"Can not take {n} random elements from a list of size {list.Count}");
            List<T> result = new List<T>();
            for(int i = 0; i < n; i++)
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