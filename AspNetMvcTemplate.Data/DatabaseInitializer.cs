using System;
using AspNetMvcTemplate.Models;
using AspNetMvcTemplate.Models.Base;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace AspNetMvcTemplate.Data
{
    /// <summary>
    /// 
    /// </summary>
    public static class DatabaseInitializer
    {
        public static void SeedMembership(ApplicationDbContext context)
        {
            var userManager = new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(context));
            var roleManager = new RoleManager<IdentityRole>(new RoleStore<IdentityRole>(context));

            const string password = "123123";

            var admin = new ApplicationUser
            {
                PhoneNumber = "0 000 000 0000",
                AccessFailedCount = 0,
                Id = Guid.NewGuid().ToString(),
                Email = "email@domain.com",
                EmailConfirmed = true,
                UserName = "email@domain.com",
                TwoFactorEnabled = false,
                PhoneNumberConfirmed = false
            };
            var adminresult = userManager.Create(admin, password);

            foreach (var role in Roles.All)
            {
                //Create Role Admin if it does not exist
                if (!roleManager.RoleExists(role))
                {
                    roleManager.Create(new IdentityRole(role));
                }

                //Add User Admin to Role Admin
                if (adminresult.Succeeded)
                {
                    userManager.AddToRole(admin.Id, role);
                }
            }

            context.MessageLogs.Add(new MessageLog
            {
                Id = Guid.NewGuid(),
                CreatedAt = DateTime.Today,
                Logger = "Seed",
                Level = "INFO",
                Thread = "0",
                Message = "The SeedMembership method of DatabaseInitializer successfully completed."
            });
        }
    }
}
