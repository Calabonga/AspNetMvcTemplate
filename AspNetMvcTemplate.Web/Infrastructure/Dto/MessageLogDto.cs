using System;

namespace AspNetMvcTemplate.Web.Infrastructure.Dto
{

    /// <summary>
    /// Data Transfer Object for LogItem
    /// </summary>
    public class MessageLogDto
    {

        /// <summary>
        /// Identifier
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// Creation Date
        /// </summary>
        public DateTime CreatedAt { get; set; }

        public string Thread { get; set; }

        public string Level { get; set; }

        public string Logger { get; set; }

        public string Message { get; set; }

        public string Exception { get; set; }

        public string Context { get; set; }
    }
}
