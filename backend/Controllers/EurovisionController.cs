using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EurovisionController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<EurovisionController> _logger;
        private readonly EurovisionContext _context;


        public EurovisionController(ILogger<EurovisionController> logger, EurovisionContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet(Name = "GetAllCountries")]
        public IEnumerable<string> Get()
        {
            return _context.Countries.Select(c => c.Name).ToArray();
        }
    }
}