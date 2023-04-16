using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Vote
{
    public Guid RecordGuid { get; set; }

    public Guid UserId { get; set; }

    public Guid? ParticipantId { get; set; }

    public Guid VoteCategoryId { get; set; }

    public int? VoteAmount { get; set; }

    public virtual Participant? Participant { get; set; }

    public virtual User User { get; set; } = null!;

    public virtual VoteCategory VoteCategory { get; set; } = null!;
}
