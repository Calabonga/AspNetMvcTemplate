using Calabonga.Configurations;

namespace AspNetMvcTemplate.Web.Infrastructure.Configuration
{
    /// <summary>
    /// Application configuration
    /// </summary>
    public class AppSettings : Configuration<CurrentAppSettings>
    {
        public AppSettings(IConfigSerializer serializer, ICacheService cacheService) :
            base(serializer, cacheService)
        {
        }

        public override string FileName
        {
            get
            {
#if DEBUG || EMAILTEST
                return "Config.Debug.json";
#else
                return "Config.json";
#endif
            }
        }

       
    }
}