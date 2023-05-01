using Eurovision.Models.Database;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Eurovision.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VoteController : ControllerBase
    {
        private readonly ILogger<VoteController> _logger;
        private readonly EurovisionContext _context;

        public VoteController(ILogger<VoteController> logger, EurovisionContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet("GetOwnVotes")]
        public IActionResult GetOwn(Guid userID) {
            try
            {
                var votes = _context.Votes.Where(v => v.UserId == userID).ToList();
                if (votes.Count == 0)
                {
                    return StatusCode(404, "No votes found");
                }
                return Ok(votes);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error has occured");
            }
        }

        [HttpGet("GetAllVotes")]
        public IActionResult GetAll()
        {
            try
            {
                var votes = _context.Votes.Include(v => v.VoteCategory).ToList();
                if (votes.Count == 0)
                {
                    return StatusCode(404, "No votes found");
                }
                return Ok(votes);
            }
            catch (Exception)
            {
                return StatusCode(500, "An error has occured");
            }
        }

        [HttpPost("CreateVote")]
        public IActionResult Create([FromBody] Vote request)
        {
            Vote vote = new Vote();
            vote.RecordGuid = Guid.NewGuid();
            vote.User = request.User;
            vote.Participant = request.Participant;
            vote.VoteAmount = request.VoteAmount;

            try
            {
                _context.Votes.Add(vote);
                _context.SaveChanges();
            }
            catch (Exception)
            {
                return StatusCode(500, "An error has occured");
            }
            var votes = _context.Votes.ToList();
            return Ok(votes);
        }
        [HttpPut("UpdateVote")]
        public IActionResult Update([FromBody] Vote request)
        {
            try
            {
                var vote = _context.Votes.FirstOrDefault(x => x.RecordGuid == request.RecordGuid);
                if (vote == null)
                {
                    return StatusCode(404, "Vote not found");
                }

                vote.User = request.User;
                vote.Participant = request.Participant;
                vote.VoteAmount = request.VoteAmount;

                _context.Entry(vote).State = EntityState.Modified;
                _context.SaveChanges();
            }
            catch (Exception)
            {
                return StatusCode(500, "An error has occured");
            }
            var votes = _context.Users.ToList();
            return Ok(votes);
        }

    }
}
