using Eurovision.Models.Database;

namespace Eurovision.Views
{
    public class VoteCategoryView
    {
        public int CategoryId { get; set; }

        public string Name { get; set; }

        public static List<VoteCategoryView> ConvertVoteCategoriesToVoteCategoryViews(List<VoteCategory> voteCategories)
        {
            return voteCategories.Select(v => new VoteCategoryView
            {
                CategoryId = v.Id,
                Name = v.VoteName
            }).ToList();
        }
    }
}
