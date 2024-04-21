
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Eurovision.Models.Database;

public partial class Event
{
    [JsonIgnore]
    [Key]
    public int Id { get; set; }

    public string? Name { get; set; }

    public string? Year { get; set; }

    public string? City { get; set; }

    public bool? IsActive { get; set; }

    public virtual Country? Country { get; set; }

    public virtual ICollection<Participant> Participants { get; set; } = new List<Participant>();

    [JsonIgnore]
    public virtual ICollection<SubCompetition> SubCompetitions { get; set; } = new List<SubCompetition>();
}
