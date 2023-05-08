using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Eurovision.Models.Database;

public partial class VoteCategory
{
    public Guid RecordGuid { get; set; }

    public string? VoteName { get; set; }

    [JsonIgnore]
    public virtual ICollection<Vote> Votes { get; set; } = new List<Vote>();
}
