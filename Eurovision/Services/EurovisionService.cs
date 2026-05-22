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

        public SubCompetitionResultView GetSubCompetitionResults(int year, int type, Guid roomId)
        {
            var subCompetitionName = SubCompetitionTypes.GetSubCompetitionType(type);
            var subCompetition = _context.SubCompetitions
                .Include(s => s.PerformanceNumbers)
                    .ThenInclude(p => p.Participant)
                    .ThenInclude(p => p.Country)
                .First(s => s.Event.Year == year.ToString() && s.Name == subCompetitionName);

            var allVOtes = _voteService.GetRoomVotesForSubcompetition(roomId, subCompetition.RecordGuid);

            return new SubCompetitionResultView(subCompetition, allVOtes);
        }

        public string GetActiveEventYear()
        {
            return _context.Events.FirstOrDefault(e => e.IsActive == true).Year;
        }

        public Country AddCountry(Country country)
        {
            country.RecordGuid = Guid.NewGuid();
            _context.Countries.Add(country);
            _context.SaveChanges();
            return country;
        }

        public Participant AddParticipant(Participant participant)
        {
            participant.RecordGuid = Guid.NewGuid();
            _context.Participants.Add(participant);
            _context.SaveChanges();
            return participant;
        }

        public Event AddEvent(Event evt)
        {
            evt.RecordGuid = Guid.NewGuid();
            _context.Events.Add(evt);
            _context.SaveChanges();
            return evt;
        }
        public void SaveParticipantOrder(List<Guid> participantIds, Guid subCompetitionId)
        {
            var performanceNumbers = _context.PerformanceNumbers
                .Where(p => p.SubCompetitionId == subCompetitionId)
                .ToList();

            for (int i = 0; i < participantIds.Count; i++)
            {
                var pn = performanceNumbers.FirstOrDefault(p => p.ParticipantId == participantIds[i]);
                if (pn != null)
                {
                    pn.PerformanceNr = i + 1;
                    _context.Entry(pn).State = EntityState.Modified;
                }
            }
            _context.SaveChanges();
        }
        public SubCompetitionView GetSubCompetitionById(Guid subCompetitionId, User user)
        {
            var subCompetition = _context.SubCompetitions
                .Include(s => s.PerformanceNumbers)
                    .ThenInclude(p => p.Participant)
                    .ThenInclude(p => p.Country)
                .First(s => s.RecordGuid == subCompetitionId);

            return new SubCompetitionView(subCompetition, new List<Vote>());
        }
    }

    public interface IEurovisionService
    {
        public SubCompetitionView GetSubCompetition(int year, int type, bool includeVotes, User user);

        public SubCompetitionResultView GetSubCompetitionResults(int year, int type, Guid roomId);

        public Event? GetEvent(int year);

        public Event? GetActiveEvent();

        public string GetActiveEventYear();
        public Country AddCountry(Country country);
        public Participant AddParticipant(Participant participant);
        public Event AddEvent(Event evt);
        public void SaveParticipantOrder(List<Guid> participantIds, Guid subCompetitionId);
        public SubCompetitionView GetSubCompetitionById(Guid subCompetitionId, User user);
    }
}
