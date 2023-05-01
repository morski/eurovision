using Azure.Core;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics.Metrics;
using System;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Eurovision.Models.Database;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;

namespace Eurovision.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FakeController : ControllerBase
    {

        private readonly ILogger<FakeController> _logger;
        private readonly EurovisionContext _context;


        public FakeController(ILogger<FakeController> logger, EurovisionContext context)
        {
            _logger = logger;
            _context = context;
        }

        [Route("auth/signin")]
        [HttpPost]
        public IActionResult Signin()
        {
            return new JsonResult(new
            {
                id = "user_id",
                username = "my_username_morski",
                accessToken = "1234asdf5678qwer"
            });
        }

        [Route("auth/signup")]
        [HttpPost]
        public IActionResult Signup()
        {
            return new JsonResult(new
            {
                id = "user_id",
                username = "my_username_morski",
                accessToken = "1234asdf5678qwer"
            });
        }

        [Route("event")]
        [HttpGet]
        public IActionResult GetEvent()
        {
            return new JsonResult(new
            {
                id = "event_id",
                year = "2023",
                location = "Liverpool",
                active = true,
                participants = new[]
                {
                    new { name = "Alessandra", song = "Queen of Kings", order = 1, country = "Norway" },
                    new { name = "The Busker", song = "Dance (Our Own Party)", order = 2, country = "Malta" },
                    new { name = "Luke Black", song = "Samo mi se spava", order = 3, country = "Serbia" },
                    new { name = "Sudden Lights", song = "Aija", order = 4, country = "Latvia" },
                    new { name = "Mimicat", song = "Ai coração", order = 5, country = "Portugal" },
                    new { name = "Wild Youth", song = "We Are One", order = 6, country = "Ireland" },
                    new { name = "Let 3", song = "Mama ŠC!", order = 7, country = "Croatia" },
                    new { name = "Remo Forrer", song = "Watergun", order = 8, country = "Switzerland" },
                    new { name = "Noa Kirel", song = "Unicorn", order = 9, country = "Israel" },
                    new { name = "Pasha Parfeni", song = "Soarele ?i luna", order = 10, country = "Moldova" },
                    new { name = "Loreen", song = "Tattoo", order = 11, country = "Sweden" },
                    new { name = "TuralTuranX", song = "Tell Me More", order = 12, country = "Azerbaijan" },
                    new { name = "Vesna", song = "My Sisters Crown", order = 13, country = "Czech Republic" },
                    new { name = "Mia Nicolai and Dion Cooper", song = "Burning Daylight", order = 14, country = "Netherlands" },
                    new { name = "Käärijä", song = "Cha Cha Cha", order = 15, country = "Finland" },
                }
            });
        }

        [Route("event/{year}/{type}")]
        [HttpGet]
        public IActionResult GetSpecificEvent(int year, int type)
        {
            if (type == 1)
            {
                return new JsonResult(new
                {
                    id = "event_id",
                    year = "2023",
                    location = "Liverpool",
                    active = true,
                    shows = new[]
                    {
                        new {
                        id = "show_id",
                        date = "2023-05-13",
                        type = 1,
                        name = "First Semi-Final",
                        active = true,
                        participants = new[]
                            {
                                new { name = "Alessandra", song = "Queen of Kings", order = 1, country = "Norway" },
                                new { name = "The Busker", song = "Dance (Our Own Party)", order = 2, country = "Malta" },
                                new { name = "Luke Black", song = "Samo mi se spava", order = 3, country = "Serbia" },
                                new { name = "Sudden Lights", song = "Aija", order = 4, country = "Latvia" },
                                new { name = "Mimicat", song = "Ai coração", order = 5, country = "Portugal" },
                                new { name = "Wild Youth", song = "We Are One", order = 6, country = "Ireland" },
                                new { name = "Let 3", song = "Mama ŠC!", order = 7, country = "Croatia" },
                                new { name = "Remo Forrer", song = "Watergun", order = 8, country = "Switzerland" },
                                new { name = "Noa Kirel", song = "Unicorn", order = 9, country = "Israel" },
                                new { name = "Pasha Parfeni", song = "Soarele ?i luna", order = 10, country = "Moldova" },
                                new { name = "Loreen", song = "Tattoo", order = 11, country = "Sweden" },
                                new { name = "TuralTuranX", song = "Tell Me More", order = 12, country = "Azerbaijan" },
                                new { name = "Vesna", song = "My Sisters Crown", order = 13, country = "Czech Republic" },
                                new { name = "Mia Nicolai and Dion Cooper", song = "Burning Daylight", order = 14, country = "Netherlands" },
                                new { name = "Käärijä", song = "Cha Cha Cha", order = 15, country = "Finland" },
                            }
                        }
                    }
                    
                });
            }
            else if (type == 2)
            {
                return new JsonResult(new
                {
                    id = "event_id",
                    year = "2023",
                    location = "Liverpool",
                    active = true,
                    shows = new[]
                    {
                        new {
                        id = "show_id",
                        date = "2023-05-13",
                        type = 2,
                        name = "Second Semi-Final",
                        active = true,
                        participants = new[]
                            {
                                new { name = "Reiley", song = "Breaking My Heart", order = 1, country = "Denmark" },
                                new { name = "Brunette", song = "Future Lover", order = 2, country = "Armenia" },
                                new { name = "Theodor Andrei", song = "D.G.T. (Off and On)", order = 3, country = "Romania" },
                                new { name = "Alika", song = "Bridges", order = 4, country = "Estonia" },
                                new { name = "Gustaph", song = "Because of You", order = 5, country = "Belgium" },
                                new { name = "Andrew Lambrou", song = "Break a Broken Heart", order = 6, country = "Cyprus" },
                                new { name = "Diljá", song = "Power", order = 7, country = "Iceland" },
                                new { name = "Victor Vernicos", song = "What They Say", order = 8, country = "Greece" },
                                new { name = "Blanka", song = "Solo", order = 9, country = "Poland" },
                                new { name = "Joker Out", song = "Carpe Diem", order = 10, country = "Slovenia" },
                                new { name = "Iru", song = "Echo", order = 11, country = "Georgia" },
                                new { name = "Piqued Jacks", song = "Like an Animal", order = 12, country = "San Marino" },
                                new { name = "Teya and Salena", song = "Who the Hell Is Edgar?", order = 13, country = "Austria" },
                                new { name = "Albina & Familja Kelmendi", song = "Duje", order = 14, country = "Albania" },
                                new { name = "Monika Linkyte", song = "Stay", order = 15, country = "Lithuania" },
                                new { name = "Voyager", song = "Promise", order = 16, country = "Australia" },
                            }
                        }
                    }

                });
            }
            else
            {
                return new JsonResult(new
                {
                    id = "event_id",
                    year = "2023",
                    location = "Liverpool",
                    active = true,
                    shows = new[]
                    {
                        new {
                        id = "show_id",
                        date = "2023-05-13",
                        type = 3,
                        name = "Grand Final",
                        active = true,
                        participants = new[]
                            {
                                new { name = "Tvorchi", song = "Heart of Steel", order = 19, country = "Ukraine" },
                                new { name = "Mae Muller", song = "I Wrote a Song", order = 26, country = "United Kingdom" },
                            }
                        }
                    }
                });
            }

        }
    }
}

