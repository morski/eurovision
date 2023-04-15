using backend.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllersWithViews();

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

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
