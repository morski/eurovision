using System;
using System.Collections.Generic;

namespace Eurovision.Models.Database;

public partial class Event
{
    public Guid RecordGuid { get; set; }

    public string? Name { get; set; }

    public string? Year { get; set; }

    public string? City { get; set; }

    public Guid? CountryId { get; set; }

    public bool? IsActive { get; set; }

    public virtual Country? Country { get; set; }

    public virtual ICollection<Participant> Participants { get; set; } = new List<Participant>();

    public virtual ICollection<SubCompetition> SubCompetitions { get; set; } = new List<SubCompetition>();
}
