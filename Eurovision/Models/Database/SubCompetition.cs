using Microsoft.Extensions.Diagnostics.HealthChecks;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Eurovision.Models.Database;

public partial class SubCompetition
{
    [JsonIgnore]
    [Key]
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    [JsonIgnore]
    public virtual Event? Event { get; set; }

    public virtual ICollection<PerformanceNumber> PerformanceNumbers { get; set; } = new List<PerformanceNumber>();

    [JsonIgnore]
    public virtual ICollection<Vote> Votes { get; set; } = new List<Vote>();
}

public static class SubCompetitionTypes
{
    public const string SemiFinal1 = "Eurovision Semi-Final 1";
    public const string SemiFinal2 = "Eurovision Semi-Final 2";
    public const string GrandFinal = "Eurovision Finals";

    public static string GetSubCompetitionType(int type)
    {
        switch (type)
        {
            case 1:
                return SemiFinal1;
            case 2: 
                return SemiFinal2;
            case 3:
                return GrandFinal;
            default:
                throw new ArgumentException("SubCompetition type is not correct");
        }
    }
}