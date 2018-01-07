namespace AspNetMvcTemplate.Models.Base {

    /// <summary>
    /// Visibility for item
    /// </summary>
    public abstract class CanBePublished : Auditable {

        /// <summary>
        /// Is item published after moderation
        /// </summary>
        public bool IsPublished { get; set; }
    }
}
