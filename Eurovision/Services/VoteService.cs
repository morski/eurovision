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

        public List<Vote> GetAllVotes(int subcompetitionId)
        {
            try
            {
                return _context.Votes.Include(v => v.VoteCategory).Where(v => v.SubCompetition.Id == subcompetitionId).ToList();
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<Vote> GetRoomVotesForSubcompetition(int roomId, int subcompetitionId)
        {
            try
            {
                var room = _context.Rooms.Include(r => r.RoomUsers).FirstOrDefault(r => r.Id == roomId);
                var subCompetition = _context.SubCompetitions.FirstOrDefault(s => s.Id == subcompetitionId);

                if(room != null) 
                {
                    var users = room.RoomUsers.Select(user => user.User).ToList();

                    return _context.Votes.Include(v => v.VoteCategory).Include(v => v.User).Include(v => v.SubCompetition).Where(v => v.SubCompetition == subCompetition && users.Contains(v.User)).ToList();
                }

                throw new ArgumentException("Invalid room");
            }
            catch (Exception)
            {
                throw;
            }
        }

        public List<Vote> GetUserVotes(int userId, int subcompetitionId)
        {
            return _context.Votes
                .Include(v => v.VoteCategory)
                .Include(v => v.Participant)
                .Where(v => v.User.Id == userId && v.SubCompetition.Id == subcompetitionId).ToList();
        }

        public List<VoteCategoryView> GetVoteCategories()
        {
            var voteCategories = _context.VoteCategories.ToList();
            return VoteCategoryView.ConvertVoteCategoriesToVoteCategoryViews(voteCategories);
        }

        public Vote UpdateVote(Vote updatedVote, int userId)
        {
            try
            {
                var votes = _context.Votes.Where(x => x.VoteCategory.Id == updatedVote.VoteCategory.Id && x.Participant.Id == updatedVote.Participant.Id && x.SubCompetition.Id == updatedVote.SubCompetition.Id && x.User.Id == userId).ToList();

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

        private Vote AddVote(Vote newVote, int userId)
        {
            var existingVote = _context.Votes.FirstOrDefault(x => x.VoteCategory.Id == newVote.VoteCategory.Id && x.Participant.Id == newVote.Participant.Id && x.SubCompetition.Id == newVote.SubCompetition.Id && x.User.Id == userId);

            Vote vote = new()
            {
                Participant = newVote.Participant,
                SubCompetition = newVote.SubCompetition,
                VoteCategory = newVote.VoteCategory,
                User = newVote.User,
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
        public List<Vote> GetUserVotes(int userId, int subcompetitionId);

        public List<VoteCategoryView> GetVoteCategories();

        public List<Vote> GetAllVotes(int subcompetitionId);

        public Vote UpdateVote(Vote vote, int userId);

        public List<Vote> GetRoomVotesForSubcompetition(int roomId, int subcompetitionId);
    }
}
