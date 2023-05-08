using Azure.Core;
using Eurovision.Models.Database;
using Eurovision.Views;
using Microsoft.EntityFrameworkCore;

namespace Eurovision.Services
{
    public class VoteService : IVoteService
    {
        private readonly EurovisionContext _context;

        public VoteService(EurovisionContext context)
        {
            _context = context;
        }

        public List<Vote> GetAllVotes()
        {
            try
            {
                return _context.Votes.Include(v => v.VoteCategory).ToList();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<Vote> GetUserVotes(Guid userId)
        {
            return _context.Votes
                .Include(v => v.VoteCategory)
                .Include(v => v.Participant)
                .Where(v => v.UserId == userId).ToList();
        }

        public List<VoteCategoryView> GetVoteCategories()
        {
            var voteCategories = _context.VoteCategories.ToList();
            return VoteCategoryView.ConvertVoteCategoriesToVoteCategoryViews(voteCategories);
        }

        public Vote UpdateVote(Vote updatedVote, Guid userId)
        {
            try
            {
                var vote = _context.Votes.FirstOrDefault(x => x.VoteCategoryId == updatedVote.VoteCategoryId && x.ParticipantId == updatedVote.ParticipantId);
                if(vote == null)
                {
                    vote = AddVote(updatedVote, userId);
                } 
                else
                {
                    vote.VoteAmount = updatedVote.VoteAmount;
                    _context.SaveChanges();
                }

                return vote;
            }
            catch (Exception)
            {
                throw;
            }
        }

        private Vote AddVote(Vote newVote, Guid userId)
        {
            Vote vote = new()
            {
                RecordGuid = Guid.NewGuid(),
                ParticipantId = newVote.ParticipantId,
                VoteCategoryId = newVote.VoteCategoryId,
                UserId = userId,
                VoteAmount = newVote.VoteAmount
            };

            try
            {
                _context.Votes.Add(vote);
                _context.SaveChanges();
            }
            catch (Exception)
            {
                throw;
            }
            return vote;
        }
    }

    public interface IVoteService
    {
        public List<Vote> GetUserVotes(Guid userId);

        public List<VoteCategoryView> GetVoteCategories();

        public List<Vote> GetAllVotes();

        public Vote UpdateVote(Vote vote, Guid userId);
    }
}
