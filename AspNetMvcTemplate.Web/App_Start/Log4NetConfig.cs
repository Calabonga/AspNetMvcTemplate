using System;
using System.Web.Mvc;
using AspNetMvcTemplate.Data.Base;
using log4net.Appender;
using log4net.Repository.Hierarchy;

namespace AspNetMvcTemplate.Web
{
    /// <summary>
    /// Log4Net initializer
    /// </summary>
    public static class Log4NetConfig
    {
        public static void Initialize()
        {
            log4net.Config.XmlConfigurator.ConfigureAndWatch(new System.IO.FileInfo(AppDomain.CurrentDomain.BaseDirectory + "/log4net.config"));
            if (log4net.LogManager.GetRepository() is Hierarchy hierarchy)
            {
                var logger = hierarchy.GetLogger("ADONetLogger", hierarchy.LoggerFactory);
                var appender = (AdoNetAppender)logger.GetAppender("AdoNetAppender");
                if (appender != null)
                {
                    appender.ConnectionString = DependencyResolver.Current.GetService<IApplicationDbContext>().Database.Connection.ConnectionString;
                    appender.ActivateOptions();
                }
            }
        }       
    }
}