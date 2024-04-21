using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Eurovision.Models.Database;

public partial class PerformanceNumber
{
    [JsonIgnore]
    [Key]
    public int Id { get; set; }

    public int? PerformanceNr { get; set; }

    public virtual Participant? Participant { get; set; }

    [JsonIgnore]
    public virtual SubCompetition? SubCompetition { get; set; }
}
