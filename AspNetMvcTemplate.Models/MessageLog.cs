using System;
using Calabonga.EntityFramework;

namespace AspNetMvcTemplate.Models
{
    /// <summary>
    /// Message logger for log4net logging
    /// </summary>
    public class MessageLog : IEntityId
    {
        public Guid Id { get; set; }

        public DateTime CreatedAt { get; set; }

        public string Thread { get; set; }

        public string Level { get; set; }

        public string Logger { get; set; }

        public string Message { get; set; }

        public string Exception { get; set; }

        public string Context { get; set; }
    }
}
