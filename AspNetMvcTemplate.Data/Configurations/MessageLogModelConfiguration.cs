using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity.ModelConfiguration;
using AspNetMvcTemplate.Models;

namespace AspNetMvcTemplate.Data.Configurations
{
    /// <summary>
    /// Model configuration for Category entity
    /// </summary>
    public class MessageLogModelConfiguration : EntityTypeConfiguration<MessageLog>
    {

        public MessageLogModelConfiguration()
        {
            ToTable("MessageLogs");

            HasKey(x => x.Id);

            Property(x => x.Id).HasDatabaseGeneratedOption(DatabaseGeneratedOption.Identity);
            Property(x => x.CreatedAt).IsRequired();
            Property(x => x.Thread).HasMaxLength(255).IsRequired();
            Property(x => x.Level).HasMaxLength(50).IsRequired();
            Property(x => x.Logger).HasMaxLength(255).IsRequired();
            Property(x => x.Message).IsRequired();
            Property(x => x.Exception);
            Property(x => x.Context);
        }
    }
}