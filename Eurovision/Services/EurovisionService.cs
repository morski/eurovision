using Eurovision.Models.Database;
using Eurovision.Views;
using Microsoft.EntityFrameworkCore;

namespace Eurovision.Services
{
    public class EurovisionService : IEurovisionService
    {
        private readonly EurovisionContext _context;
        private readonly IVoteService _voteService;

        public EurovisionService(EurovisionContext context, IVoteService voteService)
        { 
            _context = context;
            _voteService = voteService;
        }

        public SubCompetitionView GetSubCompetition(int year, int type, bool includeVotes, User user)
        {
            var subCompetitionName = SubCompetitionTypes.GetSubCompetitionType(type);
            var subCompetition = _context.SubCompetitions
                .Include(s => s.PerformanceNumbers)
                    .ThenInclude(p => p.Participant)
                    .ThenInclude(p => p.Country)
                .First(s => s.Event.Year == year.ToString() && s.Name == subCompetitionName);

            List<Vote> votes = new List<Vote>();

            if (includeVotes)
            {
                votes = _voteService.GetUserVotes(user.RecordGuid, subCompetition.RecordGuid);
            }

            return new SubCompetitionView(subCompetition, votes);
        }

        public Event? GetEvent(int year)
        {
            return _context.Events.Include(e => e.Country).FirstOrDefault(e => e.Year == year.ToString());
        }

        public Event? GetActiveEvent()
        {
            return _context.Events.Include(e => e.Country).Include(e => e.Participants).ThenInclude(p => p.Country).FirstOrDefault(e => e.IsActive == true);
        }

        public SubCompetitionResultView GetSubCompetitionResults(int year, int type)
        {
            var subCompetitionName = SubCompetitionTypes.GetSubCompetitionType(type);
            var subCompetition = _context.SubCompetitions
                .Include(s => s.PerformanceNumbers)
                    .ThenInclude(p => p.Participant)
                    .ThenInclude(p => p.Country)
                .First(s => s.Event.Year == year.ToString() && s.Name == subCompetitionName);

            var allVOtes = _voteService.GetAllVotes(subCompetition.RecordGuid);

            return new SubCompetitionResultView(subCompetition, allVOtes);
        }
    }

    public interface IEurovisionService
    {
        public SubCompetitionView GetSubCompetition(int year, int type, bool includeVotes, User user);

        public SubCompetitionResultView GetSubCompetitionResults(int year, int type);

        public Event? GetEvent(int year);

        public Event? GetActiveEvent();
    }
}
