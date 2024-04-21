﻿using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Eurovision.Models.Database
{
    public class RoomUser
    {
        [JsonIgnore]
        [Key]
        public int Id { get; set; }

        public virtual User? User { get; set; } = null!;

        public virtual Room? Room { get; set; }  = null!;
    }
}
