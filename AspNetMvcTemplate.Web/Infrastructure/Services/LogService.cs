using System;
using System.Threading.Tasks;
using AspNetMvcTemplate.Data.Base;
using AspNetMvcTemplate.Models;
using AspNetMvcTemplate.Web.Infrastructure.Configuration;
using AspNetMvcTemplate.Web.Infrastructure.MicroServices.EmailService;
using Calabonga.EntityFramework;
using log4net;

namespace AspNetMvcTemplate.Web.Infrastructure.Services
{
    /// <summary>
    /// Log service interface
    /// </summary>
    public interface ILogService : IEntityFrameworkLogService
    {
        /// <summary>
        /// Log Error message
        /// </summary>
        /// <param name="message"></param>
        void LogWarning(string message);

        /// <summary>
        /// Log Error message
        /// </summary>
        /// <param name="message"></param>
        void LogError(string message);

        /// <summary>
        /// Clear database data with system events
        /// </summary>
        /// <returns></returns>
        void ClearResult();
    }

    /// <summary>
    /// Log service is intended for saving log item to log-file and/or database
    /// </summary>
    public class LogService : ILogService, IDisposable
    {
        private readonly IApplicationDbContext _context;
        private AppSettings _appSettings;
        private IEmailService _emailService;
        private readonly ILog _logger;

        public LogService(IApplicationDbContext context, AppSettings appSettings, IEmailService emailService, ILog logger)
        {
            _context = context;
            _appSettings = appSettings;
            _emailService = emailService;
            _logger = logger;
        }

        /// <summary>
        /// Log to system event jornal message of Info
        /// </summary>
        /// <param name="message">message text</param>
        public void LogInfo(string message)
        {
            if (!_appSettings.Config.IsLogging) return;
            _logger.Info(message);
        }

        /// <summary>
        /// Log Error message
        /// </summary>
        /// <param name="message"></param>
        public void LogWarning(string message)
        {
            if (!_appSettings.Config.IsLogging) return;
            _logger.Warn(message);
        }

        /// <summary>
        /// Log Error message
        /// </summary>
        /// <param name="message"></param>
        public void LogError(string message)
        {
            if (!_appSettings.Config.IsLogging) return;
            _logger.Error(message);
            SendEmailToAdmin(message);
        }

        /// <summary>
        /// Log error as exception
        /// </summary>
        /// <param name="error"></param>
        public void LogError(Exception error)
        {
            if (!_appSettings.Config.IsLogging) return;
            if (error != null)
            {
                _logger.Error(error);
                SendEmailToAdmin(ExceptionHelper.GetMessages(error), error.StackTrace);
            }
        }

        /// <summary>
        /// Clear database data with system events
        /// </summary>
        /// <returns></returns>
        public void ClearResult()
        {
            if (!_appSettings.Config.IsLogging) return;
            if (_context.Database.ExecuteSqlCommand("truncate table MessageLogs") == 0) return;
            var message = "Журнал событий очищен";
            _context.MessageLogs.Add(new MessageLog()
            {
                CreatedAt = DateTime.Now,
                Level = "INFO",
                Message = message
            });
            _context.SaveChanges();
        }

        /// <summary>
        /// Save logItem to database
        /// </summary>
        /// <param name="logType"></param>
        /// <param name="message"></param>
        /// <param name="stackTrace"></param>
        private void SendEmailToAdmin(string message, string stackTrace = "")
        {
            if (!_appSettings.Config.IsLogging) return;
            var adminEmail = _appSettings.Config.AdminEmail;
            Task.Factory.StartNew(async () => await _emailService.SendMailAsync(adminEmail, $"Logger calabonga.net: ERROR", $"<b>Message</b>: {message}<br/><b>Stacktrace</b>:{stackTrace}"));
        }

        #region IDisposable

        /// <summary>
        /// Performs application-defined tasks associated with freeing, releasing, 
        /// or resetting unmanaged resources.
        /// </summary>
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        /// <summary>
        /// See the right way to dispose a resources 
        /// https://msdn.microsoft.com/en-us/library/ms244737.aspx
        /// </summary>
        /// <param name="disposing"></param>
        protected virtual void Dispose(bool disposing)
        {
            if (disposing)
            {
                _context?.Dispose();
                _appSettings = null;
                _emailService = null;

            }
        }

        ~LogService()
        {
            Dispose(false);
        }

        #endregion //IDisposable

    }
}