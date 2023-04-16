using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class SubCompetition
{
    public Guid RecordGuid { get; set; }

    public Guid? EventId { get; set; }

    public string Name { get; set; } = null!;

    public virtual Event? Event { get; set; }

    public virtual ICollection<PerformanceNumber> PerformanceNumbers { get; set; } = new List<PerformanceNumber>();
}
