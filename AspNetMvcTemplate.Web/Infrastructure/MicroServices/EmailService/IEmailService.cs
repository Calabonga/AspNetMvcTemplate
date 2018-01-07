using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web;

namespace AspNetMvcTemplate.Web.Infrastructure.MicroServices.EmailService
{
    /// <summary>
    /// Email Service messaging
    /// </summary>
    public interface IEmailService {
        /// <summary>
        /// Send email with attachments
        /// </summary>
        /// <param name="mailto"></param>
        /// <param name="mailSubject"></param>
        /// <param name="mailBody"></param>
        /// <param name="files"></param>
        /// <returns></returns>
        Task<MailMessage> SendMailAsync(string mailto, string mailSubject, string mailBody, ICollection<HttpPostedFileBase> files);

        /// <summary>
        /// Send email
        /// </summary>
        /// <param name="mailto"></param>
        /// <param name="mailSubject"></param>
        /// <param name="mailBody"></param>
        /// <returns></returns>
        Task<MailMessage> SendMailAsync(string mailto, string mailSubject, string mailBody);

        /// <summary>
        /// Send email
        /// </summary>
        /// <param name="message"></param>
        /// <returns></returns>
        Task<MailMessage> SendMailAsync(IMailMessage message);
    }
}