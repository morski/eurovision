using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Eurovision.Models.Database;

public partial class Vote
{
    [Key]
    public int Id { get; set; }

    public int? VoteAmount { get; set; }

    [JsonIgnore]
    public virtual Participant? Participant { get; set; }

    [JsonIgnore]
    public virtual User? User { get; set; } = null!;

    [JsonIgnore]
    public virtual VoteCategory? VoteCategory { get; set; } = null!;

    [JsonIgnore]
    public virtual SubCompetition? SubCompetition { get; set; } = null!;
}
