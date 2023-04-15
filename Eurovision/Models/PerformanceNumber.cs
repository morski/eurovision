using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class PerformanceNumber
{
    public Guid RecordGuid { get; set; }

    public Guid? SubCompetition { get; set; }

    public Guid? Participant { get; set; }

    public int? PerformanceNr { get; set; }

    public virtual Participant? ParticipantNavigation { get; set; }

    public virtual SubCompetition? SubCompetitionNavigation { get; set; }
}
