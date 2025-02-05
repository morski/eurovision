﻿using Eurovision.Models;
using Eurovision.Models.Database;

namespace Eurovision.Views
{
    public class SubCompetitionResultView
    {
        public SubCompetitionResultView(SubCompetition subCompetition, List<Vote> votes)
        {
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
                    Votes = VoteView.ConvertVotesToVoteView(votes.Where(v => v.ParticipantId == x.ParticipantId).GroupBy(v => v.VoteCategoryId).Select(g => new Vote { VoteCategoryId = g.Key, VoteAmount = g.Sum(v => v.VoteAmount) }).ToList()),
                    UserVotes = UserVoteView.ConvertVotesToUserVotes(votes.Where(v => v.ParticipantId == x.ParticipantId).ToList())
                };

            }).ToList();
        }

        public string Name { get; set; } = null!;

        public List<ParticipantView> Participants { get; set; }
    }
}
