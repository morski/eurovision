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

        public List<Vote> GetAllVotes(Guid subcompetitionId)
        {
            try
            {
                return _context.Votes.Include(v => v.VoteCategory).Where(v => v.SubCompetitionId == subcompetitionId).ToList();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<Vote> GetRoomVotesForSubcompetition(Guid roomId, Guid subcompetitionId)
        {
            try
            {
                var room = _context.Rooms.Include(r => r.RoomUsers).FirstOrDefault(r => r.Id == roomId);
                if(room != null) 
                {
                    var userIds = room.RoomUsers.Select(user => user.UserId).ToList();

                    return _context.Votes.Include(v => v.VoteCategory).Include(v => v.User).Where(v => v.SubCompetitionId == subcompetitionId && userIds.Contains(v.UserId)).ToList();
                }

                throw new ArgumentException("Invalid room");
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<Vote> GetUserVotes(Guid userId, Guid subcompetitionId)
        {
            return _context.Votes
                .Include(v => v.VoteCategory)
                .Include(v => v.Participant)
                .Where(v => v.UserId == userId && v.SubCompetitionId == subcompetitionId).ToList();
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
                var votes = _context.Votes.Where(x => x.VoteCategoryId == updatedVote.VoteCategoryId && x.ParticipantId == updatedVote.ParticipantId && x.SubCompetitionId == updatedVote.SubCompetitionId && x.UserId == userId).ToList();

                if(votes.Any())
                {
                    if (votes.Count > 1)
                    {
                        for(int i = 1; i < votes.Count; i++)
                        {
                            _context.Remove(votes[i]);
                        }

                        _context.SaveChanges();
                        return UpdateVote(updatedVote, userId);
                    }
                    else
                    {
                        votes.First().VoteAmount = updatedVote.VoteAmount;
                        _context.SaveChanges();
                        return votes.First();
                    }
                }
                else
                {
                    return AddVote(updatedVote, userId);
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        private Vote AddVote(Vote newVote, Guid userId)
        {
            var existingVote = _context.Votes.FirstOrDefault(x => x.VoteCategoryId == newVote.VoteCategoryId && x.ParticipantId == newVote.ParticipantId && x.SubCompetitionId == newVote.SubCompetitionId && x.UserId == userId);

            Vote vote = new()
            {
                RecordGuid = Guid.NewGuid(),
                ParticipantId = newVote.ParticipantId,
                VoteCategoryId = newVote.VoteCategoryId,
                SubCompetitionId = newVote.SubCompetitionId,
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
        public List<Vote> GetUserVotes(Guid userId, Guid subcompetitionId);

        public List<VoteCategoryView> GetVoteCategories();

        public List<Vote> GetAllVotes(Guid subcompetitionId);

        public Vote UpdateVote(Vote vote, Guid userId);

        public List<Vote> GetRoomVotesForSubcompetition(Guid roomId, Guid subcompetitionId);
    }
}
