using System;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using AspNetMvcTemplate.Models.Base;
using Calabonga.EntityFramework;
using Microsoft.AspNet.Identity.EntityFramework;

namespace AspNetMvcTemplate.Data.Base
{
    /// <summary>
    /// Base DbContext implementation
    /// </summary>
    public abstract class EntityFrameworkContextBase : IdentityDbContext<ApplicationUser>, IEntityFrameworkContext
    {
        protected EntityFrameworkContextBase() : base("DefaultConnection")
        {
            Configuration.AutoDetectChangesEnabled = true;
            Configuration.LazyLoadingEnabled = false;
            Configuration.ProxyCreationEnabled = false;
            Configuration.ValidateOnSaveEnabled = false;
            _lastOPerationResult = new SaveChangesResult();
        }

        private SaveChangesResult _lastOPerationResult;

        /// <summary>
        /// Last saving operation result
        /// </summary>
        public SaveChangesResult LastSaveChangesResult
        {
            get { return _lastOPerationResult; }
        }

        /// <summary>
        /// Last SaveChange operation result
        /// </summary>
        public override int SaveChanges()
        {
            try
            {
                var createdSourceInfo = ChangeTracker.Entries().Where(e => e.State == EntityState.Added);
                var modifiedSourceInfo = ChangeTracker.Entries().Where(e => e.State == EntityState.Modified);
                foreach (var entry in createdSourceInfo)
                {
                    if (entry.Entity.GetType().GetInterfaces().Contains(typeof(IHaveCreationDate)))
                    {
                        var creationDate = DateTime.Now;
                        var userName = entry.Property("CreatedBy").CurrentValue == null
                            ? "Calabonga"
                            : entry.Property("CreatedBy").CurrentValue;
                        entry.Property("CreatedAt").CurrentValue = creationDate;
                        entry.Property("UpdatedAt").CurrentValue = creationDate;
                        entry.Property("CreatedBy").CurrentValue = userName;

                        _lastOPerationResult.AddMessage($"ChangeTracker has new entities: {entry.Entity.GetType()}");
                    }
                }

                foreach (var entry in modifiedSourceInfo)
                {
                    if (entry.Entity.GetType().GetInterfaces().Contains(typeof(IHaveCreationDate)))
                    {
                        var userName = entry.Property("UpdatedBy").CurrentValue == null
                            ? "Calabonga"
                            : entry.Property("UpdatedBy").CurrentValue;
                        entry.Property("UpdatedAt").CurrentValue = DateTime.Now;
                        entry.Property("UpdatedBy").CurrentValue = userName;
                    }
                    _lastOPerationResult.AddMessage($"ChangeTracker has modified entities: {entry.Entity.GetType()}");
                }

                return base.SaveChanges();
            }
            catch (DbUpdateException exception)
            {
                _lastOPerationResult.Exception = exception;
                return 0;
            }
        }
    }
}
