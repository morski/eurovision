﻿using Eurovision.Models.Database;

namespace Eurovision.Views
{
    public class VoteView
    {
        public Guid CategoryId { get; set; }

        public int? Amount { get; set; }

        public static List<VoteView> ConvertVotesToVoteView(List<Vote> votes)
        {
            return votes.Select(v => new VoteView
            {
                Amount = v.VoteAmount,
                CategoryId = v.VoteCategoryId
            }).ToList();
        }
    }
}
