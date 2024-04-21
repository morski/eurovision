using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Eurovision.Models.Database;

public partial class User
{
    [SwaggerSchema(ReadOnly = true)]
    [Key]
    public int Id { get; set; }

    public string Username { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    [SwaggerSchema(ReadOnly = true)]
    public virtual ICollection<Role> Roles { get; set; } = new List<Role>();

    [SwaggerSchema(ReadOnly = true)]
    public virtual ICollection<Vote> Votes { get; set; } = new List<Vote>();

    [SwaggerSchema(ReadOnly = true)]
    public virtual ICollection<RoomUser> RoomUsers { get; set; } = new List<RoomUser>();

    public void Validate()
    {
        if (Username == null)
        {
            throw new ArgumentNullException("Username missing");
        }

        if (Password == null)
        {
            throw new ArgumentNullException("Password missing");
        }
    }
}
