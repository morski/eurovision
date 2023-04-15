using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VoteController : ControllerBase
    {
        private readonly ILogger<VoteController> _logger;
        private readonly EurovisionContext _context;

        public VoteController(ILogger<VoteController> logger, EurovisionContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet("GetVotes")]
        public IActionResult Get() {
            return Ok();
        }
        [HttpPost("CreateVote")]
        public IActionResult Create([FromBody] Vote request)
        {
            return Ok();
        }
        [HttpPut("UpdateVote")]
        public IActionResult Update([FromBody] Vote request)
        {
            return Ok();
        }

    }
}
