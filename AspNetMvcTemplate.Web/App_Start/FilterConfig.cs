using System.Web.Mvc;
using log4net;

namespace AspNetMvcTemplate.Web
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new Log4NetExceptionFilter());
            filters.Add(new HandleErrorAttribute());
        }
    }

    public class Log4NetExceptionFilter : IExceptionFilter
    {
        private ILog logger = LogManager.GetLogger(typeof(MvcApplication));

        public void OnException(ExceptionContext context)
        {
            logger.Error(context.Exception);
        }
    }
}
