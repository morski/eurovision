using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Azure.Core;
using Eurovision.Models.Database;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;

namespace Eurovision.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
        public IActionResult Create([FromBody] User request)
        {
            User user = new()
            {
                Username = request.Username,
                Password = request.Password,
                FirstName = request.FirstName,
                LastName = request.LastName
            };

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
        public IActionResult Update([FromBody] User request)
        {
            try {
                var user = _context.Users.FirstOrDefault(x => x.Id == request.Id);
                if(user == null)
                {
                    return StatusCode(404, "User not found");
                }

                user.Username = request.Username;
                user.Password = request.Password;
                user.FirstName = request.FirstName;
                user.LastName = request.LastName;

                _context.Entry(user).State = EntityState.Modified;
                _context.SaveChanges();
            }
            catch (Exception) {
                return StatusCode(500, "An error has occured");
            }
            var users = _context.Users.ToList();
            return Ok(users);
        }
        [HttpDelete("DeleteUser/{userId}")]
        public IActionResult Delete([FromRoute] int userId)
        {
            try {
                var user = _context.Users.FirstOrDefault(x => x.Id == userId);
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
    }
}
