using System.Data.Entity;
using AspNetMvcTemplate.Models;
using Calabonga.EntityFramework;

namespace AspNetMvcTemplate.Data.Base
{

    /// <summary>
    /// Facts DbContext
    /// </summary>
    public interface IApplicationDbContext : IEntityFrameworkContext
    {

        #region Entites

        /// <summary>
        /// log4net messages
        /// </summary>
        DbSet<MessageLog> MessageLogs { get; set; }

        #endregion
    }
}