using Eurovision.Models.Database;
using Eurovision.Services;
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
        private readonly IVoteService _voteService;

        public VoteController(ILogger<VoteController> logger, IVoteService voteService)
        {
            _logger = logger;
            _voteService = voteService;
        }

        [HttpGet]
        [Route("user")]
        public IActionResult GetVotesForUser()
        {
            if (HttpContext.Items["User"] is not User user)
            {
                return StatusCode(404, "User not found");
            }

            //TODO Fix sub id
            return new JsonResult(_voteService.GetUserVotes(user.RecordGuid, Guid.Empty));
        }

        [HttpGet]
        [Route("categories")]
        public IActionResult GetVoteCategories()
        {
            return new JsonResult(_voteService.GetVoteCategories());
        }

        [HttpGet]
        [Route("all")]
        public IActionResult GetAllVotes()
        {
            //TODO Fix sub id
            return new JsonResult(_voteService.GetAllVotes(Guid.Empty));
        }

        [HttpPut]
        [Route("update")]
        public IActionResult Update([FromBody] Vote request)
        {
            if (HttpContext.Items["User"] is not User user)
            {
                return StatusCode(404, "User not found");
            }

            return new JsonResult(_voteService.UpdateVote(request, user.RecordGuid));
        }

    }
}
