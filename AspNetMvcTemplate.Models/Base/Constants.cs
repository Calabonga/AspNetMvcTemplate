using System.Collections.Generic;

namespace AspNetMvcTemplate.Models.Base
{

    /// <summary>
    /// Static repostory for application's contants
    /// </summary>
    public static class Constants
    {
        public const string RoleNameAdministrator = "Administrator";
    }

    public static class Roles
    {
        public static IEnumerable<string> All
        {
            get
            {
                yield return Constants.RoleNameAdministrator;
            }
        }
    }

}
