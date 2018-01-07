using System.Reflection;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using AspNetMvcTemplate.Data;
using AspNetMvcTemplate.Data.Base;
using AspNetMvcTemplate.Web.Infrastructure.Configuration;
using AspNetMvcTemplate.Web.Infrastructure.EntityMapper;
using AspNetMvcTemplate.Web.Infrastructure.MicroServices.EmailService;
using AspNetMvcTemplate.Web.Infrastructure.Services;
using Autofac;
using Autofac.Integration.Mvc;
using Autofac.Integration.WebApi;
using Calabonga.Configurations;
using Calabonga.EntityFramework;
using ExpressMapper;
using log4net;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.DataProtection;
using CookieManager = Microsoft.Owin.Infrastructure.CookieManager;

namespace AspNetMvcTemplate.Web.Infrastructure
{

    /// <summary>
    /// Registrations of the dependecies
    /// </summary>
    public static class DependencyContainer
    {
        public static void Initialize()
        {
            var builder = new ContainerBuilder();
            var assembly = Assembly.GetExecutingAssembly();
            var logger = LogManager.GetLogger(typeof(MvcApplication));
            builder.Register(c => logger).As<ILog>();
            builder.RegisterModule<AutofacWebTypesModule>();
            builder.RegisterControllers(assembly);
            builder.RegisterApiControllers(assembly);
            builder.RegisterModelBinders(assembly);
            builder.RegisterAssemblyTypes(typeof(MvcApplication).Assembly).AsImplementedInterfaces();
            builder.RegisterFilterProvider();

            builder.RegisterType<AppSettings>().AsSelf().InstancePerRequest();
            builder.RegisterType<JsonConfigSerializer>().As<IConfigSerializer>().InstancePerRequest();
            builder.RegisterType<ApplicationDbContext>().As<IApplicationDbContext>().As<IEntityFrameworkContext>().InstancePerRequest();
            builder.RegisterType<ApplicationUserManager>().InstancePerRequest();
            builder.RegisterType<ApplicationSignInManager>().InstancePerRequest();
            builder.Register(c => new UserStore<ApplicationUser>((ApplicationDbContext)c.Resolve<IApplicationDbContext>())).AsImplementedInterfaces().InstancePerRequest();
            builder.Register(c => new IdentityFactoryOptions<ApplicationUserManager> { DataProtectionProvider = new DpapiDataProtectionProvider("ApplicationDataProtectionProvider") }).InstancePerRequest();
            builder.Register(c => new RoleManager<IdentityRole>(new RoleStore<IdentityRole>((ApplicationDbContext)c.Resolve<IApplicationDbContext>()))).As<RoleManager<IdentityRole>>().InstancePerRequest();
            builder.Register(c => HttpContext.Current.GetOwinContext().Authentication).As<IAuthenticationManager>();

            builder.RegisterType<CacheService>().As<ICacheService>().InstancePerRequest();
            builder.RegisterType<JsonConfigSerializer>().As<IConfigSerializer>().InstancePerRequest();

            builder.RegisterType<LogService>().As<ILogService>().As<IEntityFrameworkLogService>().InstancePerRequest();
            builder.RegisterType<CookieManager>().AsSelf();
            builder.RegisterType<EmailService>().As<IEmailService>().InstancePerRequest();

            //Registers ExpressMapper
            var mapper = new EntityFrameworkMapper(Mapper.Instance);
            mapper.RegisterMaps();
            builder.Register(c => mapper).As<IEntityFrameworkMapper>().SingleInstance();

            //Registers all Repository by reflection
            builder.RegisterAssemblyTypes(Assembly.GetExecutingAssembly())
                .Where(x => x.Name.EndsWith("Repository"))
                .AsSelf()
                .InstancePerRequest();

            var container = builder.Build();
            DependencyResolver.SetResolver(new AutofacDependencyResolver(container));
            GlobalConfiguration.Configuration.DependencyResolver = new AutofacWebApiDependencyResolver(container);
        }
    }
}

