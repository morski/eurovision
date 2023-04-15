using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Azure.Core;

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
        public IActionResult Get()
        {
            //User user = _context.Users.First(u => u.FirstName == "Tomas");
            //return user;
            try { 
            var users = _context.Users.ToList();
            if (users.Count == 0 )
            {
                return StatusCode(404, "No users found");
            }
            return Ok(users);
            }
            catch (Exception) 
            {
                return StatusCode(500, "An error has occured");
            }
        }
        [HttpPost("CreateUser")]
        public IActionResult Create([FromBody] UserRequest request)
        {
            //User user = _context.Users.(u => u.FirstName == "Tomas");
            User user = new User();
            user.RecordGuid = Guid.NewGuid();
            user.Username = request.username;
            user.Password = request.password;
            user.FirstName = request.first_name;
            user.LastName = request.last_name;
            
            try {
                _context.Users.Add(user);
                _context.SaveChanges();
            }
            catch (Exception)
            {
                return StatusCode(500, "An error has occured");
            }
            var users = _context.Users.ToList();
            return Ok(users);
        }

        [HttpPut("UpdateUser")]
        public IActionResult Update([FromBody] UserRequest request)
        {
            try {
                var user = _context.Users.FirstOrDefault(x => x.RecordGuid == request.record_guid);
                if(user == null)
                {
                    return StatusCode(404, "User not found");
                }

                user.Username = request.username;
                user.Password = request.password;
                user.FirstName = request.first_name;
                user.LastName = request.last_name;

                _context.Entry(user).State = EntityState.Modified;
                _context.SaveChanges();
            }
            catch (Exception) {
                return StatusCode(500, "An error has occured");
            }
            var users = _context.Users.ToList();
            return Ok(users);
        }
        [HttpDelete("DeleteUser/{record_guid}")]
        public IActionResult Delete([FromRoute] Guid record_guid)
        {
            try {
                var user = _context.Users.FirstOrDefault(x => x.RecordGuid == record_guid);
                if (user == null)
                {
                    return StatusCode(404, "User not found");
                }

                _context.Entry(user).State = EntityState.Deleted; 
                _context.SaveChanges();
            } 
            catch (Exception) {
                return StatusCode(500, "An error has occured");
            }
            var users = _context.Users.ToList();
            return Ok(users);
        }

        //Test
        //private List<UserRequest> GetUsers(){
        //    return new List < UserRequest > { 
        //    new UserRequest {username = "TomasTest", first_name="Tomas"}
        //   };
        //}
    }
}
