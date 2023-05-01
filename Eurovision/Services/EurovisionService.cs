using Eurovision.Models.Database;

namespace Eurovision.Services
{
    public class EurovisionService : IEurovisionService
    {
        private readonly EurovisionContext _context;

        public EurovisionService(EurovisionContext context)
        { 
            _context = context;
        }

    public SubCompetition GetSubCompetition(int year, int type)
        {
            var subCompetitionName = SubCompetitionTypes.GetSubCompetitionType(type);
            return _context.SubCompetitions.First(s => s.Event.Year == year.ToString() && s.Name == subCompetitionName);
        }
    }

    public interface IEurovisionService
    {
        public SubCompetition GetSubCompetition(int year, int type);

    }
}
