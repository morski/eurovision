using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Eurovision.Models.Database;

public partial class PerformanceNumber
{
    [JsonIgnore]
    public Guid RecordGuid { get; set; }

    [JsonIgnore]
    public Guid? SubCompetitionId { get; set; }

    [JsonIgnore]
    public Guid? ParticipantId { get; set; }

    public int? PerformanceNr { get; set; }

    public virtual Participant? Participant { get; set; }

    [JsonIgnore]
    public virtual SubCompetition? SubCompetition { get; set; }
}
