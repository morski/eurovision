using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class VoteCategory
{
    public Guid RecordGuid { get; set; }

    public string? VoteName { get; set; }

    public virtual ICollection<Vote> Votes { get; set; } = new List<Vote>();
}
