namespace Eurovision.Models.Database;

public partial class Role
{
    public Guid Id { get; set; }
    public int UserRole { get; set; }
    public Guid UserId { get; set; }
    public virtual User User { get; set; } = null!;
}