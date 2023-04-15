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
        [HttpGet("GetUsers")]
        public IActionResult Get()
        {
           //var users = GetUsers();
            return Ok();
        }
        [HttpPost("CreateUser")]
        public IActionResult Create([FromBody] UserRequest request)
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
