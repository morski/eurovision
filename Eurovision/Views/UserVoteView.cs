using Eurovision.Models.Database;

namespace Eurovision.Views
{
    public class UserVoteView
    {
        public string Name { get; set; } = null!;

        public int VoteAmount { get; set; }

        public static List<UserVoteView> ConvertVotesToUserVotes(List<Vote> votes)
        {
            var group = votes.GroupBy(v => v.User);

            return group.Select(g => new UserVoteView
            {
                VoteAmount = g.Sum(v => v.VoteAmount) ?? 0,
                Name = g.Key.Username
            }).ToList();
        }
    }
}
