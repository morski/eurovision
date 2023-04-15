using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Participant
{
    public Guid RecordGuid { get; set; }

    public Guid Country { get; set; }

    public Guid Event { get; set; }

    public string? Artist { get; set; }

    public string? Song { get; set; }

    public virtual Country CountryNavigation { get; set; } = null!;

    public virtual Event EventNavigation { get; set; } = null!;

    public virtual ICollection<PerformanceNumber> PerformanceNumbers { get; set; } = new List<PerformanceNumber>();

    public virtual ICollection<Vote> Votes { get; set; } = new List<Vote>();
}
