
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Eurovision.Models.Database;

public partial class Country
{
    [JsonIgnore]
    [Key]
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? Flag { get; set; }

    [JsonIgnore]
    public virtual ICollection<Event> Events { get; set; } = new List<Event>();

    [JsonIgnore]
    public virtual ICollection<Participant> Participants { get; set; } = new List<Participant>();
}


