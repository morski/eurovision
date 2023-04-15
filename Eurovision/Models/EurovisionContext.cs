﻿using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace backend.Models;

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

    public virtual DbSet<Vote> Votes { get; set; }

    public virtual DbSet<VoteCategory> VoteCategories { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.UseCollation("Finnish_Swedish_CI_AS");

        modelBuilder.Entity<Country>(entity =>
        {
            entity.HasKey(e => e.RecordGuid);

            entity.ToTable("countries");

            entity.Property(e => e.RecordGuid)
                .ValueGeneratedNever()
                .HasColumnName("record_guid");
            entity.Property(e => e.Flag)
                .HasMaxLength(50)
                .IsFixedLength()
                .HasColumnName("flag");
            entity.Property(e => e.Name)
                .HasMaxLength(30)
                .IsFixedLength()
                .HasColumnName("name");
        });

        modelBuilder.Entity<Event>(entity =>
        {
            entity.HasKey(e => e.RecordGuid);

            entity.ToTable("event");

            entity.Property(e => e.RecordGuid)
                .ValueGeneratedNever()
                .HasColumnName("record_guid");
            entity.Property(e => e.City)
                .HasMaxLength(50)
                .HasColumnName("city");
            entity.Property(e => e.Country).HasColumnName("country");
            entity.Property(e => e.IsActive).HasColumnName("isActive");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
            entity.Property(e => e.Year)
                .HasMaxLength(50)
                .HasColumnName("year");

            entity.HasOne(d => d.CountryNavigation).WithMany(p => p.Events)
                .HasForeignKey(d => d.Country)
                .HasConstraintName("FK_event_countries");
        });

        modelBuilder.Entity<Participant>(entity =>
        {
            entity.HasKey(e => e.RecordGuid);

            entity.ToTable("participants");

            entity.Property(e => e.RecordGuid)
                .ValueGeneratedNever()
                .HasColumnName("record_guid");
            entity.Property(e => e.Artist)
                .HasMaxLength(50)
                .HasColumnName("artist");
            entity.Property(e => e.Country).HasColumnName("country");
            entity.Property(e => e.Event).HasColumnName("event");
            entity.Property(e => e.Song)
                .HasMaxLength(50)
                .HasColumnName("song");

            entity.HasOne(d => d.CountryNavigation).WithMany(p => p.Participants)
                .HasForeignKey(d => d.Country)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_participants_countries");

            entity.HasOne(d => d.EventNavigation).WithMany(p => p.Participants)
                .HasForeignKey(d => d.Event)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_participants_event");
        });

        modelBuilder.Entity<PerformanceNumber>(entity =>
        {
            entity.HasKey(e => e.RecordGuid);

            entity.ToTable("performance_numbers");

            entity.Property(e => e.RecordGuid)
                .ValueGeneratedNever()
                .HasColumnName("record_guid");
            entity.Property(e => e.Participant).HasColumnName("participant");
            entity.Property(e => e.PerformanceNr).HasColumnName("performance_nr");
            entity.Property(e => e.SubCompetition).HasColumnName("sub_competition");

            entity.HasOne(d => d.ParticipantNavigation).WithMany(p => p.PerformanceNumbers)
                .HasForeignKey(d => d.Participant)
                .HasConstraintName("FK_performance_numbers_participants");

            entity.HasOne(d => d.SubCompetitionNavigation).WithMany(p => p.PerformanceNumbers)
                .HasForeignKey(d => d.SubCompetition)
                .HasConstraintName("FK_performance_numbers_sub_competitions");
        });

        modelBuilder.Entity<SubCompetition>(entity =>
        {
            entity.HasKey(e => e.RecordGuid);

            entity.ToTable("sub_competitions");

            entity.Property(e => e.RecordGuid)
                .ValueGeneratedNever()
                .HasColumnName("record_guid");
            entity.Property(e => e.Event).HasColumnName("event");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");

            entity.HasOne(d => d.EventNavigation).WithMany(p => p.SubCompetitions)
                .HasForeignKey(d => d.Event)
                .HasConstraintName("FK_sub_competitions_event");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.RecordGuid).HasName("users_pk");

            entity.ToTable("users");

            entity.Property(e => e.RecordGuid)
                .ValueGeneratedNever()
                .HasColumnName("record_guid");
            entity.Property(e => e.FirstName)
                .HasMaxLength(50)
                .HasColumnName("first_name");
            entity.Property(e => e.LastName)
                .HasMaxLength(50)
                .HasColumnName("last_name");
            entity.Property(e => e.Password)
                .HasMaxLength(30)
                .IsFixedLength()
                .HasColumnName("password");
            entity.Property(e => e.Username)
                .HasMaxLength(50)
                .HasColumnName("username");
        });

        modelBuilder.Entity<Vote>(entity =>
        {
            entity.HasKey(e => e.RecordGuid);

            entity.ToTable("votes");

            entity.Property(e => e.RecordGuid)
                .ValueGeneratedNever()
                .HasColumnName("record_guid");
            entity.Property(e => e.Participant).HasColumnName("participant");
            entity.Property(e => e.User).HasColumnName("user");
            entity.Property(e => e.VoteAmount).HasColumnName("vote_amount");
            entity.Property(e => e.VoteCategory).HasColumnName("vote_category");

            entity.HasOne(d => d.ParticipantNavigation).WithMany(p => p.Votes)
                .HasForeignKey(d => d.Participant)
                .HasConstraintName("FK_votes_participants");

            entity.HasOne(d => d.UserNavigation).WithMany(p => p.Votes)
                .HasForeignKey(d => d.User)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_votes_users");

            entity.HasOne(d => d.VoteCategoryNavigation).WithMany(p => p.Votes)
                .HasForeignKey(d => d.VoteCategory)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_votes_vote_categories");
        });

        modelBuilder.Entity<VoteCategory>(entity =>
        {
            entity.HasKey(e => e.RecordGuid);

            entity.ToTable("vote_categories");

            entity.Property(e => e.RecordGuid)
                .ValueGeneratedNever()
                .HasColumnName("record_guid");
            entity.Property(e => e.VoteName)
                .HasMaxLength(50)
                .HasColumnName("vote_name");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}