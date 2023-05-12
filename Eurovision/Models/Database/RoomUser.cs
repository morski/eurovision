using System.Text.Json.Serialization;

namespace Eurovision.Models.Database
{
    public class RoomUser
    {
        [JsonIgnore]
        public Guid Id { get; set; }

        public Guid RoomId { get; set; }

        public Guid UserId { get; set; }

        public virtual User? User { get; set; } = null!;

        public virtual Room? Room { get; set; }  = null!;
    }
}
