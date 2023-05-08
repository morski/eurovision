using Eurovision.Models.Database;

namespace Eurovision.Views
{
    public class VoteCategoryView
    {
        public Guid CategoryId { get; set; }

        public string Name { get; set; }

        public static List<VoteCategoryView> ConvertVoteCategoriesToVoteCategoryViews(List<VoteCategory> voteCategories)
        {
            return voteCategories.Select(v => new VoteCategoryView
            {
                CategoryId = v.RecordGuid,
                Name = v.VoteName
            }).ToList();
        }
    }
}
