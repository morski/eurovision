using Eurovision.Models.Database;
using Eurovision.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Eurovision.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EurovisionController : ControllerBase
    {
        private readonly ILogger<EurovisionController> _logger;
        private readonly IEurovisionService _eurovisionService;
        public EurovisionController(ILogger<EurovisionController> logger, IEurovisionService eurovisionService)
        {
            _logger = logger;
            _eurovisionService = eurovisionService;
        }

        [HttpGet]
        [Route("subcompetition/{year}/{type}")]
        public IActionResult GetSubcompetition(int year, int type, bool includeVotes)
        {
            var user = HttpContext.Items["User"];
            return new JsonResult(_eurovisionService.GetSubCompetition(year, type, includeVotes, user as User));
        }

        [HttpGet]
        [Route("subcompetition/{year}/{type}/result")]
        public IActionResult GetSubcompetitionResults(int year, int type)
        {
            var user = HttpContext.Items["User"];
            return new JsonResult(_eurovisionService.GetSubCompetitionResults(year, type));
        }

        [HttpGet]
        [Route("event/{year}")]
        public IActionResult GetEvent(int year)
        {
            return new JsonResult(_eurovisionService.GetEvent(year));
        }

        [HttpGet]
        [Route("event/active")]
        public IActionResult GetActiveEvent()
        {
            var result = new JsonResult(_eurovisionService.GetActiveEvent());
            return result;
        }
    }
}