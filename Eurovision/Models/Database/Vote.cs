using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace Eurovision.Models.Database;

public partial class Vote
{
    public Guid RecordGuid { get; set; }

    public Guid UserId { get; set; }

    public Guid? ParticipantId { get; set; }

    public Guid VoteCategoryId { get; set; }

    public int? VoteAmount { get; set; }

    [JsonIgnore]
    public virtual Participant? Participant { get; set; }

    [JsonIgnore]
    public virtual User? User { get; set; } = null!;

    [JsonIgnore]
    public virtual VoteCategory? VoteCategory { get; set; } = null!;
}
