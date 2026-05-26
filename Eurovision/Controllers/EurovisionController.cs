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
        public IActionResult AddParticipant([FromBody] AddParticipantRequest request)
        {
            try
            {
                var participant = new Participant
                {
                    RecordGuid = Guid.NewGuid(),
                    Artist = request.Artist,
                    Song = request.Song,
                    CountryId = request.CountryId,
                    EventId = request.EventId
                };
                _context.Participants.Add(participant);
                _context.SaveChanges();
                return Ok(new { recordGuid = participant.RecordGuid });
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
        public IActionResult AddSubCompetition([FromBody] AddSubCompetitionRequest request)
        {
            try
            {
                _logger.LogInformation("Adding subcompetition: Name={Name}, EventId={EventId}", request.Name, request.EventId);

                var subCompetition = new SubCompetition
                {
                    RecordGuid = Guid.NewGuid(),
                    Name = request.Name,
                    EventId = request.EventId
                };
                _context.SubCompetitions.Add(subCompetition);
                _context.SaveChanges();

                _logger.LogInformation("Saved subcompetition: RecordGuid={RecordGuid}, EventId={EventId}", subCompetition.RecordGuid, subCompetition.EventId);

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
        [AllowAnonymous]
        [HttpGet]
        [Route("subcompetitions/active")]
        public IActionResult GetActiveSubCompetitions()
        {
            var activeEvent = _context.Events.FirstOrDefault(e => e.IsActive == true);
            if (activeEvent == null) return NotFound();

            var subs = _context.SubCompetitions
                .Where(s => s.EventId == activeEvent.RecordGuid)
                .Select(s => new {
                    recordGuid = s.RecordGuid,
                    name = s.Name
                })
                .ToList();
            return new JsonResult(subs);
        }
        [AllowAnonymous]
        [HttpGet]
        [Route("event/active/full")]
        public IActionResult GetActiveEventFull()
        {
            var activeEvent = _context.Events
                .Include(e => e.Country)
                .Include(e => e.Participants)
                    .ThenInclude(p => p.Country)
                .FirstOrDefault(e => e.IsActive == true);
            if (activeEvent == null) return NotFound();
            return new JsonResult(new
            {
                recordGuid = activeEvent.RecordGuid,
                name = activeEvent.Name,
                year = activeEvent.Year,
                city = activeEvent.City,
                isActive = activeEvent.IsActive,
                country = activeEvent.Country,
                participants = activeEvent.Participants
            });
        }
        [HttpGet]
        [Route("participants/{eventId}")]
        [Authorize]
        public IActionResult GetParticipantsByEvent(Guid eventId)
        {
            var participants = _context.Participants
                .Where(p => p.EventId == eventId)
                .Include(p => p.Country)
                .Select(p => new {
                    recordGuid = p.RecordGuid,
                    artist = p.Artist,
                    song = p.Song,
                    country = new { name = p.Country.Name }
                })
                .ToList();
            return new JsonResult(participants);
        }

        [HttpPost]
        [Route("admin/assignparticipant")]
        [Authorize(Roles = "Admin")]
        public IActionResult AssignParticipantToShow([FromBody] AssignParticipantRequest request)
        {
            try
            {
                // Check if already assigned
                var existing = _context.PerformanceNumbers
                    .FirstOrDefault(p => p.ParticipantId == request.ParticipantId
                        && p.SubCompetitionId == request.SubCompetitionId);
                if (existing != null)
                    return BadRequest("Participant already assigned to this show");

                var performanceNumber = new PerformanceNumber
                {
                    RecordGuid = Guid.NewGuid(),
                    ParticipantId = request.ParticipantId,
                    SubCompetitionId = request.SubCompetitionId,
                    PerformanceNr = request.PerformanceNr
                };
                _context.PerformanceNumbers.Add(performanceNumber);
                _context.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error assigning participant to show");
                return StatusCode(500, "An error has occurred");
            }
        }
        [HttpGet]
        [Route("subcompetition/byid/{subCompetitionId}/result/{roomId}")]
        public IActionResult GetSubcompetitionResultsById(Guid subCompetitionId, Guid roomId)
        {
            return new JsonResult(_eurovisionService.GetSubCompetitionResultsById(subCompetitionId, roomId));
        }
    }
    public class AddSubCompetitionRequest
    {
        public string Name { get; set; } = null!;
        public Guid EventId { get; set; }
    }
    public class AddParticipantRequest
    {
        public string? Artist { get; set; }
        public string? Song { get; set; }
        public Guid CountryId { get; set; }
        public Guid EventId { get; set; }
    }
    public class AssignParticipantRequest
    {
        public Guid ParticipantId { get; set; }
        public Guid SubCompetitionId { get; set; }
        public int PerformanceNr { get; set; }
    }
}