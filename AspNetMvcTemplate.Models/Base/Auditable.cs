using System;

namespace AspNetMvcTemplate.Models.Base {

    /// <summary>
    /// Auditable base class for
    /// </summary>
    public abstract class Auditable : Identity, IHaveCreationDate {

        /// <summary>
        /// Date and time item creation
        /// </summary>
        public DateTime CreatedAt { get; set; }

        /// <summary>
        /// Date and time item update
        /// </summary>
        public DateTime? UpdatedAt { get; set; }

        /// <summary>
        /// Created by
        /// </summary>
        public string CreatedBy { get; set; }

        /// <summary>
        /// Updated by
        /// </summary>
        public string UpdatedBy { get; set; }
    }
}
