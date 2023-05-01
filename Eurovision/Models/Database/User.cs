using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Eurovision.Models.Database;

public partial class User
{
    [SwaggerSchema(ReadOnly = true)]
    public Guid RecordGuid { get; set; }

    public string Username { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    [SwaggerSchema(ReadOnly = true)]
    public virtual ICollection<Vote> Votes { get; set; } = new List<Vote>();

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

        if (FirstName == null)
        {
            throw new ArgumentNullException("Username missing");
        }

        if (LastName == null)
        {
            throw new ArgumentNullException("Password missing");
        }
    }
}
