using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Eurovision.Models.Database;

public partial class Participant
{
    [JsonIgnore]
    [Key]
    public int Id { get; set; }

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
