using Eurovision.Models;
using Eurovision.Models.Database;
using Eurovision.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Eurovision.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RoomController : ControllerBase
    {
        private readonly IRoomService _roomService;

        public RoomController(IRoomService roomService)
        {
            _roomService = roomService;
        }

        [HttpPost("create")]
        public IActionResult CreateRoom([FromBody] RoomRequest request)
        {
            if (HttpContext.Items["User"] is not User user)
            {
                return StatusCode(404, "User not found");
            }
            try
            {
                return new JsonResult(_roomService.CreateRoom(request, user.RecordGuid));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("join")]
        public IActionResult JoinRoom([FromBody] RoomRequest request)
        {
            if (HttpContext.Items["User"] is not User user)
            {
                return StatusCode(404, "User not found");
            }

            try
            {
                return new JsonResult(_roomService.JoinRoom(request, user.RecordGuid));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpDelete("leave/{roomId}")]
        public IActionResult LeaveRoom(Guid roomId)
        {
            if (HttpContext.Items["User"] is not User user)
            {
                return StatusCode(404, "User not found");
            }

            try
            {
                return new JsonResult(_roomService.LeaveRoom(roomId, user.RecordGuid));
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("all")]
        public IActionResult GetUserRooms()
        {
            if (HttpContext.Items["User"] is not User user)
            {
                return StatusCode(404, "User not found");
            }

            return new JsonResult(_roomService.GetAllRoomsForUser(user.RecordGuid));
        }
    }
}
