using Azure.Core;
using Eurovision.Models;
using Eurovision.Models.Database;
using Eurovision.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Eurovision.Services
{
    public class UserService : IUserService
    {
        private readonly IConfiguration _configuration;
        private readonly EurovisionContext _context;

        public UserService(IConfiguration configuration, EurovisionContext context)
        {
            _context = context;
            _configuration = configuration;
        }

        public User? GetUserDetails(Guid userId)
        {
            return _context.Users.FirstOrDefault(u => u.RecordGuid == userId);
        }

        public User? GetUserDetails(string username)
        {
            return _context.Users.FirstOrDefault(u => u.Username == username);
        }

        public dynamic RegisterNewUser(User newUser)
        {
            try
            {
                if (newUser != null)
                {
                    var existingUser = GetUserDetails(newUser.Username);
                    if (existingUser != null)
                    {
                        throw new Exception("Username already exists!");
                    }

                    newUser.Validate();
                    newUser.RecordGuid = Guid.NewGuid();

                    _context.Users.Add(newUser);
                    _context.SaveChanges();
                    var token = new JwtUtil(_configuration).GenerateJwtToken(newUser.RecordGuid, 1, false);
                    var refreshToken = new JwtUtil(_configuration).GenerateJwtToken(newUser.RecordGuid, 24, true);
                    return new { Token = token, RefreshToken = refreshToken, UserId = newUser.RecordGuid, newUser.Username };
                }
                    
                throw new Exception("Shit hit the fan. Try again!");
                
            }
            catch (Exception)
            {
                throw;
            }

        }
    }

    public interface IUserService
    {
        User? GetUserDetails(Guid userId);

        User? GetUserDetails(string username);

        dynamic RegisterNewUser(User newUser);
    }
}
