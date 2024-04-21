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
            if (login != null && login.Username != null && login.Password != null)
            {
                using var scope = _services.CreateScope();
                var context = scope.ServiceProvider.GetRequiredService<EurovisionContext>();
                var user = context.Users.FirstOrDefault(u => u.Username == login.Username);


                

                if (user != null)
                {
                    PasswordHasher hasher = new PasswordHasher();
                    var ok = hasher.Check(user.Password, login.Password);

                    if(ok)
                    {
                        var jwtUtil = scope.ServiceProvider.GetRequiredService<JwtUtil>();
                        var token = jwtUtil.GenerateJwtToken(user.Id, 1, false);
                        var refreshToken = jwtUtil.GenerateJwtToken(user.Id, 24, true);
                        return new { Token = token, RefreshToken = refreshToken, UserId = user.Id, user.Username };
                    }
                }
            }

            throw new Exception("Invalid Username or Password");
        }

        public dynamic RefreshToken(int userId)
        {
            using var scope = _services.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<EurovisionContext>();
            var user = context.Users.FirstOrDefault(u => u.Id == userId);

            if (user != null)
            {
                var jwtUtil = scope.ServiceProvider.GetRequiredService<JwtUtil>();
                var token = jwtUtil.GenerateJwtToken(userId, 1, false);
                var refreshToken = jwtUtil.GenerateJwtToken(userId, 24, true);
                return new { Token = token, RefreshToken = refreshToken, UserId = user.Id, user.Username };
            }

            throw new Exception("Invalid UserId");
        }

        
    }

    public interface IAuthService
    {
        dynamic ValidateLogin(LoginModel login);

        dynamic RefreshToken(int userId);
    }
}
