using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Eurovision.Models.Database
{
    public class Role
    {
        [JsonIgnore]
        [Key]
        public int Id { get; set; }

        public Roles UserRole {  get; set; } 

        public virtual User? User { get; set; } = null!;
    }
}
