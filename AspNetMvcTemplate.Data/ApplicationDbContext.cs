using System.Data.Entity;
using AspNetMvcTemplate.Data.Base;
using AspNetMvcTemplate.Models;

namespace AspNetMvcTemplate.Data
{
    /// <summary>
    /// Database DbContext
    /// </summary>
    public class ApplicationDbContext : EntityFrameworkContextBase, IApplicationDbContext
    {
        /// <summary>
        /// log4net messages
        /// </summary>
        public DbSet<MessageLog> MessageLogs { get; set; }

        // Customize the ASP.NET Identity model and override the defaults if needed.
        // For example, you can rename the ASP.NET Identity table names and more.
        // Add your customizations after calling base.OnModelCreating(builder);
        protected override void OnModelCreating(DbModelBuilder builder)
        {
            builder.Configurations.AddFromAssembly(typeof(ApplicationDbContext).Assembly);
            base.OnModelCreating(builder);
        }

        public static ApplicationDbContext Create()
        {
            return new ApplicationDbContext();
        }
    }
}
