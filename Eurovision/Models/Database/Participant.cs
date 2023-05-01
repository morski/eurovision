using System;
using System.Collections.Generic;

namespace Eurovision.Models.Database;

public partial class Participant
{
    public Guid RecordGuid { get; set; }

    public Guid CountryId { get; set; }

    public Guid EventId { get; set; }

    public string? Artist { get; set; }

    public string? Song { get; set; }

    public virtual Country Country { get; set; } = null!;

    public virtual Event Event { get; set; } = null!;

    public virtual ICollection<PerformanceNumber> PerformanceNumbers { get; set; } = new List<PerformanceNumber>();

    public virtual ICollection<Vote> Votes { get; set; } = new List<Vote>();
}
