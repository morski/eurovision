using Eurovision.Models.Database;
using Eurovision.Services;
using Eurovision.Utils;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Middleware;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();

builder.Services.Configure<RouteOptions>(options =>
{
    options.LowercaseUrls = true;
});

builder.Configuration.AddKeyPerFile("/secrets/", true);

var conStrBuilder = new SqlConnectionStringBuilder()
{
    Password = builder.Configuration["DbPassword"],
    UserID = builder.Configuration["DbUsername"],
    DataSource = builder.Configuration["DbServer"],
    InitialCatalog = "eurovision",
    TrustServerCertificate = true
};

builder.Services.AddDbContext<EurovisionContext>(options =>
        options.UseSqlServer(conStrBuilder.ConnectionString));

builder.Services.AddTransient<IAuthService, AuthService>();
builder.Services.AddTransient<IUserService, UserService>();
builder.Services.AddTransient<IVoteService, VoteService>();
builder.Services.AddTransient<IRoomService, RoomService>();
builder.Services.AddTransient<IEurovisionService, EurovisionService>(e => {
    var service = e.GetService<IVoteService>();
    var context = e.GetService<EurovisionContext>();
    return new EurovisionService(context, service);
});

builder.Services.AddTransient<JwtUtil>();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(swagger =>
{
    //This is to generate the Default UI of Swagger Documentation
    swagger.SwaggerDoc("v1", new OpenApiInfo
    {
        Version = "v1",
        Title = "Eurovision API",
        Description = "API for Eurovision voting app"
    });
    // To Enable authorization using Swagger (JWT)
    swagger.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
    {
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then your token in the text input below.\r\n\r\nExample: \"Bearer 12345abcdef\"",
    });
    swagger.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });

    // Enable attribute annotations in Swagger (e.g., [SwaggerOperation]).
    swagger.EnableAnnotations();
});

// Configure authentication to use JWT Bearer tokens by default.
builder.Services.AddAuthentication(option =>
{
    option.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    option.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;

}).AddJwtBearer(options =>
{
    // Token validation settings. Note: ValidateLifetime is false here (tokens won't be checked for expiry).
    // If you want automatic expiry validation, set ValidateLifetime = true.
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = false,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // In non-development environments enable HSTS for extra security.
    // Default HSTS value is 30 days.
    app.UseHsts();
}

if (app.Environment.IsDevelopment())
{
    // Enable Swagger UI only in development for API exploration.
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Serve static files from wwwroot (SPA assets, js, css, index.html).
app.UseStaticFiles();

// Enable authentication middleware (reads and sets ClaimsPrincipal on HttpContext).
app.UseAuthentication();

// Add routing middleware to evaluate route matching.
app.UseRouting();

// For requests whose path starts with /api, run a custom JWTMiddleware (e.g., to handle token refresh,
// custom header behavior, or alternative validation). This isolates middleware to API endpoints only.
app.UseWhen(context => context.Request.Path.StartsWithSegments("/api"), appBuilder =>
{
    appBuilder.UseMiddleware<JWTMiddleware>();
});

// Enable authorization middleware which checks policies and [Authorize] attributes.
app.UseAuthorization();

// Map controller endpoints and require authorization globally for them.
// Controllers will need a valid authenticated principal unless specific actions allow anonymous access.
app.MapControllers().RequireAuthorization();

// For any routes not matched by controllers (SPA client), fall back to serving index.html.
app.MapFallbackToFile("index.html");

// Start the application and listen for incoming HTTP requests.
app.Run();


