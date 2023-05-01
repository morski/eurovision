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
                    var tokenString = jwtUtil.GenerateJwtToken(user.RecordGuid);
                    return new { Token = tokenString, UserId = user.RecordGuid, user.Username };
                }
            }

            throw new Exception("Please pass the valid Username and Password");
        }
    }

    public interface IAuthService
    {
        dynamic ValidateLogin(LoginModel login);
    }
}
