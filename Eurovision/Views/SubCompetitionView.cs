using Eurovision.Models;
using Eurovision.Models.Database;

namespace Eurovision.Views
{
    public class SubCompetitionView
    {
        public SubCompetitionView(SubCompetition subCompetition, List<Vote> votes)
        {
            Id = subCompetition.RecordGuid;
            Name = subCompetition.Name;
            Participants = subCompetition.PerformanceNumbers.Select(x =>
            {
                return new ParticipantView
                {
                    Id = x.Participant.RecordGuid,
                    Artist = x.Participant.Artist,
                    Song = x.Participant.Song,
                    Order = x.PerformanceNr,
                    Country = new CountryView
                    {
                        Name = x.Participant.Country.Name
                    },
                    Votes = VoteView.ConvertVotesToVoteView(votes.Where(v => v.ParticipantId == x.ParticipantId).ToList())
                };

            }).ToList();
        }

        public Guid? Id { get; set; } = null;

        public string Name { get; set; } = null!;

        public List<ParticipantView> Participants { get; set; }
    }
}
