
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Eurovision.Models.Database;

public partial class Country
{
    [JsonIgnore]
    public Guid RecordGuid { get; set; }

    public string? Name { get; set; }

    public string? Flag { get; set; }

    [JsonIgnore]
    public virtual ICollection<Event> Events { get; set; } = new List<Event>();

    [JsonIgnore]
    public virtual ICollection<Participant> Participants { get; set; } = new List<Participant>();
}


