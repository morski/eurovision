using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Country
{
    public Guid RecordGuid { get; set; }

    public string? Name { get; set; }

    public string? Flag { get; set; }

    public virtual ICollection<Event> Events { get; set; } = new List<Event>();

    public virtual ICollection<Participant> Participants { get; set; } = new List<Participant>();
}
