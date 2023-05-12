using System.Text.Json.Serialization;

namespace Eurovision.Models.Database
{
    public partial class Room
    {
        [JsonIgnore]
        public Guid Id { get; set; }

        public string Name { get; set; } = null!;

        public string Password { get; set; } = null!;

        public virtual ICollection<RoomUser> RoomUsers { get; set; } = new List<RoomUser>();
    }
}
