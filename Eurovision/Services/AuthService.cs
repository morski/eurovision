using Eurovision.Models;
using Eurovision.Models.Database;
using Eurovision.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Eurovision.Services
{
    public class AuthService : IAuthService
    {
        public IServiceProvider _services { get; }

        public AuthService(IServiceProvider services)
        {
            _services = services;
        }

        public dynamic ValidateLogin(LoginModel login)
        {
            if (login != null && login.Username != null)
            {
                using var scope = _services.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<EurovisionContext>();
                var user = context.Users.FirstOrDefault(u => u.Username == login.Username && u.Password == login.Password);

                if (user != null)
                {
                    var jwtUtil = scope.ServiceProvider.GetRequiredService<JwtUtil>();
                    var token = jwtUtil.GenerateJwtToken(user.RecordGuid, 1, false);
                    var refreshToken = jwtUtil.GenerateJwtToken(user.RecordGuid, 24, true);
                    return new { Token = token, RefreshToken = refreshToken, UserId = user.RecordGuid, user.Username };
                }
            }

            throw new Exception("Invalid Username or Password");
        }

        public dynamic RefreshToken(Guid userId)
        {
            using var scope = _services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<EurovisionContext>();
            var user = context.Users.FirstOrDefault(u => u.RecordGuid == userId);

            if (user != null)
            {
                var jwtUtil = scope.ServiceProvider.GetRequiredService<JwtUtil>();
                var token = jwtUtil.GenerateJwtToken(userId, 1, false);
                var refreshToken = jwtUtil.GenerateJwtToken(userId, 24, true);
                return new { Token = token, RefreshToken = refreshToken, UserId = user.RecordGuid, user.Username };
            }

            throw new Exception("Invalid UserId");
        }
    }

    public interface IAuthService
    {
        dynamic ValidateLogin(LoginModel login);

        dynamic RefreshToken(Guid userId);
    }
}
