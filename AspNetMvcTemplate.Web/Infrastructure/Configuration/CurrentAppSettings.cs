namespace AspNetMvcTemplate.Web.Infrastructure.Configuration
{
    /// <summary>
    /// Application Settings
    /// </summary>
    public class CurrentAppSettings
    {
        /// <summary>
        /// Returns interval between saving current post on end minutes
        /// </summary>
        public int AutoSaveOnEditInterval { get; set; }

        /// <summary>
        /// Returns true autosaving is enabled when post edidting
        /// </summary>
        public bool AutoSaveOnEditEnabled { get; set; }

        /// <summary>
        /// Paged list use this settings by default
        /// </summary>
        public int DefaultPageSize { get; set; }

        /// <summary>
        /// Use or not HTML markup for notification
        /// </summary>
        public bool IsHtmlForEmailMessagesEnabled { get; set; }

        /// <summary>
        /// Notification for administrator email address
        /// </summary>
        public string AdminEmail { get; set; }
        /// <summary>
        /// Enabled logging
        /// </summary>
        public bool IsLogging { get; set; }

        /// <summary>
        /// Domain name for templates
        /// </summary>
        public string DomainUrl { get; set; }

        /// <summary>
        /// Email robot no reply
        /// </summary>
        public string RobotEmail { get; set; }

        /// <summary>
        /// Название сайта
        /// </summary>
        public string CompanyName { get; set; }

        /// <summary>
        /// Upload imaged for posts folder name
        /// </summary>
        public string UploadFolderName { get; set; }

        public EmailServer EmailServer { get; set; }

        /// <summary>
        /// persiof for TOP
        /// </summary>
        public int TopInDays { get; set; }

        public bool SplittedLanguageMode { get; set; }
    }

    /// <summary>
    /// Settings for MailKit
    /// </summary>
    public class EmailServer
    {
        public string ServerSmtp { get; set; }

        public int Port { get; set; }

        public string Secure { get; set; }

        public string UserName { get; set; }
    }
}