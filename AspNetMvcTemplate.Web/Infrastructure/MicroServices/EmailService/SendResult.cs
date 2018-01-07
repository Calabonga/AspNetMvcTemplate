using System;

namespace AspNetMvcTemplate.Web.Infrastructure.MicroServices.EmailService
{
    /// <summary>
    /// MailKit send result
    /// </summary>
    public class SendResult {
        public bool IsSended { get; set; }
        public bool IsInProcess { get; set; }
        public Exception Exception { get; set; }
    }
}