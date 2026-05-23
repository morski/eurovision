using Eurovision.Models.Database;
using Eurovision.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Eurovision.Controllers
{


    [ApiController]
    [Route("api/[controller]")]
    public class EurovisionController : ControllerBase
    {
        private readonly ILogger<EurovisionController> _logger;
        private readonly IEurovisionService _eurovisionService;
        private readonly EurovisionContext _context;
        public EurovisionController(ILogger<EurovisionController> logger, IEurovisionService eurovisionService, EurovisionContext context)
        {
            _logger = logger;
            _eurovisionService = eurovisionService;
            _context = context;
        }

        [HttpGet]
        [Route("subcompetition/{year}/{type}")]
        public IActionResult GetSubcompetition(int year, int type, bool includeVotes)
        {
            var user = HttpContext.Items["User"];
            return new JsonResult(_eurovisionService.GetSubCompetition(year, type, includeVotes, user as User));
        }

        [HttpGet]
        [Route("subcompetition/{year}/{type}/result/{roomId}")]
        public IActionResult GetSubcompetitionResults(int year, int type, Guid roomId)
        {
            return new JsonResult(_eurovisionService.GetSubCompetitionResults(year, type, roomId));
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
        [AllowAnonymous]
        [HttpGet]
        [Route("countries")]
        public IActionResult GetCountries()
        {
            var countries = _context.Countries
                .Select(c => new {
                    recordGuid = c.RecordGuid,
                    name = c.Name
                })
                .ToList();
            return new JsonResult(countries);
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("event/active/year")]
        public IActionResult GetEventYear()
        {
            return new JsonResult(_eurovisionService.GetActiveEventYear());
        }

        [HttpPost]
        [Route("admin/country")]
        [Authorize(Roles = "Admin")]
        public IActionResult AddCountry([FromBody] Country country)
        {
            try
            {
                var result = _eurovisionService.AddCountry(country);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding country");
                return StatusCode(500, "An error has occurred");
            }
        }

        [HttpPost]
        [Route("admin/participant")]
        [Authorize(Roles = "Admin")]
        public IActionResult AddParticipant([FromBody] Participant participant)
        {
            try
            {
                var result = _eurovisionService.AddParticipant(participant);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding participant");
                return StatusCode(500, "An error has occurred");
            }
        }

        [HttpPost]
        [Route("admin/event")]
        [Authorize(Roles = "Admin")]
        public IActionResult AddEvent([FromBody] Event evt)
        {
            try
            {
                var result = _eurovisionService.AddEvent(evt);
                return Ok(result);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding event");
                return StatusCode(500, "An error has occurred");
            }
        }

        [HttpPost]
        [Route("admin/upload/{year}/{countryName}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UploadParticipantImage(int year, string countryName, IFormFile file)
        {
            try
            {
                var fileName = $"{countryName.ToLower().Trim().Replace(" ", "_")}-hero.jpeg";
                var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "ClientApp", "public", "images", year.ToString(), "participants", "hero");

                Directory.CreateDirectory(folderPath);

                var filePath = Path.Combine(folderPath, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }
                return Ok(new { fileName });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error uploading image");
                return StatusCode(500, "An error has occurred");
            }
        }
        [HttpPost]
        [Route("admin/order/{subCompetitionId}")]
        [Authorize(Roles = "Admin")]
        public IActionResult SaveParticipantOrder(Guid subCompetitionId, [FromBody] List<Guid> participantIds)
        {
            try
            {
                _eurovisionService.SaveParticipantOrder(participantIds, subCompetitionId);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error saving participant order");
                return StatusCode(500, "An error has occurred");
            }
        }
        [HttpGet]
        [Route("subcompetitions/{year}")]
        public IActionResult GetSubCompetitions(int year)
        {
            var subCompetitions = _context.SubCompetitions
                .Where(s => s.Event.Year == year.ToString())
                .Select(s => new {
                    recordGuid = s.RecordGuid,
                    name = s.Name
                })
                .ToList();
            return new JsonResult(subCompetitions);
        }
        [HttpGet]
        [Route("subcompetition/byid/{subCompetitionId}")]
        public IActionResult GetSubcompetitionById(Guid subCompetitionId)
        {
            var user = HttpContext.Items["User"];
            return new JsonResult(_eurovisionService.GetSubCompetitionById(subCompetitionId, user as User));
        }
        [AllowAnonymous]
        [HttpGet]
        [Route("events")]
        public IActionResult GetEvents()
        {
            var events = _context.Events
                .Select(e => new {
                    recordGuid = e.RecordGuid,
                    name = e.Name,
                    year = e.Year,
                    city = e.City,
                    isActive = e.IsActive
                })
                .ToList();
            return new JsonResult(events);
        }

        [HttpPost]
        [Route("admin/subcompetition")]
        [Authorize(Roles = "Admin")]
        public IActionResult AddSubCompetition([FromBody] SubCompetition subCompetition)
        {
            try
            {
                subCompetition.RecordGuid = Guid.NewGuid();
                _context.SubCompetitions.Add(subCompetition);
                _context.SaveChanges();
                return Ok(new { recordGuid = subCompetition.RecordGuid, name = subCompetition.Name });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error adding sub-competition");
                return StatusCode(500, "An error has occurred");
            }
        }

        [HttpPut]
        [Route("admin/event/setactive/{eventId}")]
        [Authorize(Roles = "Admin")]
        public IActionResult SetActiveEvent(Guid eventId)
        {
            try
            {
                var events = _context.Events.ToList();
                foreach (var e in events)
                {
                    e.IsActive = e.RecordGuid == eventId;
                    _context.Entry(e).State = EntityState.Modified;
                }
                _context.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error setting active event");
                return StatusCode(500, "An error has occurred");
            }
        }
    }
}