using Eurovision.Models.Database;

namespace Eurovision.Views
{
    public class ParticipantView
    {
        public Guid Id { get; set; }

        public string Artist { get; set; } = null!;

        public string Song { get; set; } = null!;

        public int? Order { get; set; }

        public CountryView Country { get; set; } = null!;

        public List<VoteView> Votes { get; set; }

        public List<UserVoteView> UserVotes { get; set; }
    }
}
