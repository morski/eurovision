using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Vote
{
    public Guid RecordGuid { get; set; }

    public Guid User { get; set; }

    public Guid? Participant { get; set; }

    public Guid VoteCategory { get; set; }

    public int? VoteAmount { get; set; }

    public virtual Participant? ParticipantNavigation { get; set; }

    public virtual User UserNavigation { get; set; } = null!;

    public virtual VoteCategory VoteCategoryNavigation { get; set; } = null!;
}
