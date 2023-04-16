using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class PerformanceNumber
{
    public Guid RecordGuid { get; set; }

    public Guid? SubCompetitionId { get; set; }

    public Guid? ParticipantId { get; set; }

    public int? PerformanceNr { get; set; }

    public virtual Participant? Participant { get; set; }

    public virtual SubCompetition? SubCompetition { get; set; }
}
