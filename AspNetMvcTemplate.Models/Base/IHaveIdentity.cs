using System;

namespace AspNetMvcTemplate.Models.Base {

    /// <summary>
    /// Entity with Title
    /// </summary>
    public interface IHaveTitle
    {
        /// <summary>
        /// Title of the Post
        /// </summary>
        string Title { get; set; }
    }

    /// <summary>
    /// Entity with ID
    /// </summary>
    public interface IHaveIdentifier {

        /// <summary>
        /// Identifier
        /// </summary>
        Guid Id { get; set; }
    }
}
