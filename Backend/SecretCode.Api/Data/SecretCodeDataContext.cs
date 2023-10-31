using Microsoft.EntityFrameworkCore;
using SecretCode.Api.Models;

namespace SecretCode.Api.Data;

public class SecretCodeDataContext: DbContext
{
    #region Constructors
    public SecretCodeDataContext(DbContextOptions<SecretCodeDataContext> options): base(options)
    {
    }

    #endregion

    #region Entities
    public DbSet<User> Users { get; set; }
    public DbSet<Ingredient> Ingredients { get; set; }
    #endregion

    #region Override Methods
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        modelBuilder.Entity<User>()
            .Property(_ => _.Name)
            .IsRequired();
        
        modelBuilder.Entity<User>()
            .HasKey(_ => _.Id);
    }
    #endregion    
}


