using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Eurovision.Models.Database;

public partial class Participant
{
    [JsonIgnore]
    public Guid RecordGuid { get; set; }

    [JsonIgnore]
    public Guid CountryId { get; set; }

    [JsonIgnore]
    public Guid EventId { get; set; }

    public string? Artist { get; set; }

    public string? Song { get; set; }

    public virtual Country Country { get; set; } = null!;

    [JsonIgnore]
    public virtual Event Event { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<PerformanceNumber> PerformanceNumbers { get; set; } = new List<PerformanceNumber>();

    [JsonIgnore]
    public virtual ICollection<Vote> Votes { get; set; } = new List<Vote>();
}
