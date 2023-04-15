using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class User
{
    public Guid RecordGuid { get; set; }

    public string Username { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string? FirstName { get; set; }

    public string? LastName { get; set; }

    public virtual ICollection<Vote> Votes { get; set; } = new List<Vote>();
}
