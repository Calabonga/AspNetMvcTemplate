using System;

namespace AspNetMvcTemplate.Models.Base {

    /// <summary>
    /// Identity base
    /// </summary>
    public abstract class Identity : IHaveIdentifier {

        public Guid Id { get; set; }

    }
}