using backend.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using System.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

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
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
