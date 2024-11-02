using ChatotTrainingCamp.Services;

namespace ChatotTrainingCamp.Models
{
    public class Question
    {
        public List<int> Propositions { get; set; }
        public int Answer { get; set; }
        public DateTime? StartDate { get; set; }

        public Question(List<int> propositions) { 
            this.Propositions = propositions;
            this.Answer = RandomService.RandomElementFromList(propositions);
        }
    }
}
