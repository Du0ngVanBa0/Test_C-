using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore;
using Sapota.Model;
using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace Sapota.Repository
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            AutoRegisterAndConfigureEntities(modelBuilder);
        }

        private void AutoRegisterAndConfigureEntities(ModelBuilder modelBuilder)
        {
            var entityTypes = Assembly.GetExecutingAssembly()
                .GetTypes()
                .Where(t => t.IsClass &&
                           !t.IsAbstract &&
                           (t.IsSubclassOf(typeof(BaseModel)) || t == typeof(RefreshToken)))
                .ToList();

            foreach (var entityType in entityTypes)
            {
                var entity = modelBuilder.Entity(entityType);

                AutoConfigureEntity(entity, entityType);
            }
        }

        private void AutoConfigureEntity(Microsoft.EntityFrameworkCore.Metadata.Builders.EntityTypeBuilder entity, Type entityType)
        {
            var keyProperty = entityType.GetProperties()
                .FirstOrDefault(p => p.GetCustomAttribute<KeyAttribute>() != null || p.Name == "Id");

            if (keyProperty != null)
            {
                entity.HasKey(keyProperty.Name);
            }

            var foreignKeyProperties = entityType.GetProperties()
                .Where(p => p.Name.EndsWith("Id") && p.PropertyType == typeof(Guid))
                .Where(p => p.Name != "Id");

            foreach (var fkProp in foreignKeyProperties)
            {
                var navigationPropertyName = fkProp.Name.Replace("Id", "");
                var relatedEntityType = Assembly.GetExecutingAssembly()
                    .GetTypes()
                    .FirstOrDefault(t => t.Name == navigationPropertyName);

                if (relatedEntityType != null)
                {
                    entity.HasOne(relatedEntityType)
                          .WithMany()
                          .HasForeignKey(fkProp.Name)
                          .OnDelete(DeleteBehavior.Cascade);
                }
            }

            if (entityType.IsSubclassOf(typeof(BaseModel)))
            {
                entity.Property("CreatedAt").HasDefaultValueSql("UTC_TIMESTAMP()");
                entity.Property("UpdatedAt").HasDefaultValueSql("UTC_TIMESTAMP()");
                entity.Property("IsActive").HasDefaultValue(true);

                entity.HasIndex("IsActive");
                entity.HasIndex("CreatedAt");
            }
        }

        public override int SaveChanges()
        {
            UpdateTimestamps();
            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            UpdateTimestamps();
            return await base.SaveChangesAsync(cancellationToken);
        }

        private void UpdateTimestamps()
        {
            var entries = ChangeTracker.Entries()
                .Where(e => e.Entity is BaseModel && (e.State == EntityState.Added || e.State == EntityState.Modified));

            foreach (var entry in entries)
            {
                var entity = (BaseModel)entry.Entity;

                if (entry.State == EntityState.Added)
                {
                    entity.CreatedAt = DateTime.UtcNow;
                }

                entity.UpdatedAt = DateTime.UtcNow;
            }
        }
    }
}
