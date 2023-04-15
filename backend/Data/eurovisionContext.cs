using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public class eurovisionContext : DbContext
    {
        public eurovisionContext(DbContextOptions<eurovisionContext> options):base(options)
        {
            
        }
        public DbSet<users> users 
        { get; set; }
    }
}
