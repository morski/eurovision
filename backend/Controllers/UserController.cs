using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly EurovisionContext _context;


        public UserController(ILogger<UserController> logger, EurovisionContext context)
        {
            _logger = logger;
            _context = context;
        }

        [HttpGet("GetUsers")]
        public User Get()
        {
            User user = _context.Users.First(u => u.FirstName == "Tomas");
            return user;
        }
        [HttpPost("CreateUser")]
        public User Create([FromBody] UserRequest request)
        {
            return Ok();
        }
        [HttpPut("UpdateUser")]
        public IActionResult Update([FromBody] UserRequest request)
        {
            return Ok();
        }
        [HttpDelete("DeleteUser/{record_guid}")]
        public IActionResult Delete(Guid record_guid)
        {
            return Ok();
        }

        //Test
        //private List<UserRequest> GetUsers(){
        //    return new List < UserRequest > { 
        //    new UserRequest {username = "TomasTest", first_name="Tomas"}
        //   };
        //}
    }
}
