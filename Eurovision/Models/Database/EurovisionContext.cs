using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Eurovision.Models.Database;

public partial class EurovisionContext : DbContext
{
    public EurovisionContext()
    {
    }

    public EurovisionContext(DbContextOptions<EurovisionContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Country> Countries { get; set; }

    public virtual DbSet<Event> Events { get; set; }

    public virtual DbSet<Participant> Participants { get; set; }

    public virtual DbSet<PerformanceNumber> PerformanceNumbers { get; set; }

    public virtual DbSet<SubCompetition> SubCompetitions { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Vote> Votes { get; set; }

    public virtual DbSet<VoteCategory> VoteCategories { get; set; }

    public virtual DbSet<Room> Rooms { get; set; }

    public virtual DbSet<RoomUser> RoomUsers { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.UseCollation("Finnish_Swedish_CI_AS");

        modelBuilder.Entity<RoomUser>().Navigation(r =>  r.User).AutoInclude();
        modelBuilder.Entity<RoomUser>().Navigation(r => r.Room).AutoInclude();

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
