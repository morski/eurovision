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
        public IActionResult GetSubcompetition(int year, int type)
        {
            return new JsonResult(_eurovisionService.GetSubCompetition(year, type));
        }
    }
}