using Eurovision.Models.Database;
using Eurovision.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace Middleware
{
    public class JWTMiddleware
    {   
        private readonly RequestDelegate _next;
        private readonly IConfiguration _configuration;
        public IServiceProvider _services { get; }

        public JWTMiddleware(RequestDelegate next, IConfiguration configuration, IServiceProvider services)
        {
            _next = next;
            _configuration = configuration;
            _services = services;
        }

        public async Task Invoke(HttpContext context)
        {
            var endpoint = context.GetEndpoint();
            if(endpoint?.Metadata?.GetMetadata<IAllowAnonymous>() is object)
            {
                await _next(context);
                return;
            }

            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            
            var validatedToken = ValidateToken(token);

            if (validatedToken != null)
            {
                await attachAccountToContextAsync(context, validatedToken);
                await _next(context);
            }
            else
            {
                var bytes = Encoding.UTF8.GetBytes("JWT MIDDLEWARE TOOK IT TO 401 - " + context.Request.Path);
                await context.Response.Body.WriteAsync(bytes, 0, bytes.Length);
                context.Response.ContentType = "application/json";
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                
                await context.Response.StartAsync();
            }
        }

        private SecurityToken? ValidateToken(string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    // set clockskew to zero so tokens expire exactly at token expiration time (instead of 5 minutes later)
                    ClockSkew = TimeSpan.Zero,
                    ValidIssuer = _configuration["Jwt:Issuer"],
                    ValidAudience = _configuration["Jwt:Audience"]
                }, out SecurityToken validatedToken);
                
                return validatedToken;
            }
            catch {
                return null;
            }
        }

        private async Task attachAccountToContextAsync(HttpContext context, SecurityToken validatedToken)
        {
            try
            {
                var jwtToken = (JwtSecurityToken)validatedToken;
                var userId = jwtToken.Claims.First(x => x.Type == "id").Value;

                // attach account to context on successful jwt validation
                using var scope = _services.CreateScope();
                var userService = scope.ServiceProvider.GetRequiredService<IUserService>();
                context.Items["User"] = userService.GetUserDetails(Guid.Parse(userId));
            }
            catch { }
        }
    }
}