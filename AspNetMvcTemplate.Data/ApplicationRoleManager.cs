using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace AspNetMvcTemplate.Data
{
    public class ApplicationRoleManager : RoleManager<IdentityRole>
    {

        public ApplicationRoleManager(IRoleStore<IdentityRole> store) : base(store)
        {
        }
    }
}