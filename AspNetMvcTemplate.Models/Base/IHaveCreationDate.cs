using System;

namespace AspNetMvcTemplate.Models.Base
{
    /// <summary>
    /// Represents the creation date and last update info
    /// </summary>
    public interface IHaveCreationDate {

        /// <summary>
        /// Дата добавления в базу
        /// </summary>
        DateTime CreatedAt { get; set; }

        /// <summary>
        /// Property Обновление
        /// </summary>
        DateTime? UpdatedAt { get; set; }
    }
}