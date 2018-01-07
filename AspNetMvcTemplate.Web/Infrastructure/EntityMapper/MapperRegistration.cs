using Calabonga.EntityFramework;

namespace AspNetMvcTemplate.Web.Infrastructure.EntityMapper
{
    /// <summary>
    /// Registers mapping
    /// </summary>
    public static class MapperRegistrations
    {
        public static void Register(IEntityFrameworkMapper mapper)
        {
            mapper.RegisterMaps();
        }
    }
}