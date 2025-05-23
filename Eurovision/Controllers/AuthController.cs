﻿using Eurovision.Models;
using Eurovision.Models.Database;
using Eurovision.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Eurovision.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IAuthService _authService;
        private readonly IUserService _userService;

        public AuthController(IConfiguration configuration, IAuthService loginService, IUserService userService)
        {
            _configuration = configuration;
            _authService = loginService;
            _userService = userService;
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("login")]
        public IActionResult Auth([FromBody] LoginModel login)
        {
            try
            {
                return new JsonResult(_authService.ValidateLogin(login));
            }
            catch (Exception ex)
            {
                return BadRequest(new{ Error = ex.Message});
            }
        }

        [HttpGet]
        [Route("validate-token")]
        public IActionResult GetResult()
        {
            return Ok("API Validated");
        }

        [AllowAnonymous]
        [HttpPost]
        [Route("register")]
        public IActionResult Register([FromBody] User newUser)
        {
            try
            {
                return new JsonResult(_userService.RegisterNewUser(newUser));
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }

        [HttpGet]
        [Route("refreshToken")]
        public IActionResult RefreshToken()
        {
            try
            {
                var user = HttpContext.Items["User"] as User;
                if (user != null)
                {
                    return new JsonResult(_authService.RefreshToken(user.RecordGuid));
                }

                throw new ArgumentNullException(nameof(user));
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }
    }
}
