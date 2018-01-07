using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web;
using AspNetMvcTemplate.Web.Infrastructure.Configuration;
using MailKit.Net.Smtp;
using Microsoft.AspNet.Identity;
using MimeKit;

namespace AspNetMvcTemplate.Web.Infrastructure.MicroServices.EmailService
{

    /// <summary>
    /// EmailService
    /// </summary>
    public class EmailService : IEmailService, IIdentityMessageService
    {
        private readonly CurrentAppSettings _appSettings;

        public EmailService(AppSettings options)
        {
            _appSettings = options.Config;
        }

        /// <summary>
        /// Send email with attachments
        /// </summary>
        /// <param name="mailto"></param>
        /// <param name="mailSubject"></param>
        /// <param name="mailBody"></param>
        /// <param name="files"></param>
        /// <returns></returns>
        public Task<MailMessage> SendMailAsync(string mailto, string mailSubject, string mailBody, ICollection<HttpPostedFileBase> files)
        {
            return SendMailFromServerAsync(mailto, mailSubject, mailBody, files, true);
        }

        /// <summary>
        /// Send email
        /// </summary>
        /// <param name="mailto"></param>
        /// <param name="mailSubject"></param>
        /// <param name="mailBody"></param>
        /// <returns></returns>
        public Task<MailMessage> SendMailAsync(string mailto, string mailSubject, string mailBody)
        {
            return SendMailFromServerAsync(mailto, mailSubject, mailBody, null, true);
        }

        /// <summary>
        /// Send email
        /// </summary>
        /// <param name="message"></param>
        /// <returns></returns>
        public Task<MailMessage> SendMailAsync(IMailMessage message)
        {
            return SendMailFromServerAsync(message.MailTo, message.Subject, message.Body, null, true);
        }

        private async Task<MailMessage> SendMailFromServerAsync(string mailto, string mailSubject, string mailBody, ICollection<HttpPostedFileBase> files, bool isHtml)
        {
            var message = new MailMessage
            {
                MailTo = mailto,
                MailFrom = _appSettings.RobotEmail,
                Subject = mailSubject,
                Body = mailBody,
                IsHtml = isHtml
            };
#if  (EMAILTEST || !DEBUG)
            message.Result.IsInProcess = true;
            try
            {

                var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress("Email Robot", message.MailFrom));
                emailMessage.To.Add(new MailboxAddress(message.MailTo));
                emailMessage.Subject = message.Subject;
                emailMessage.Body = new TextPart("html") { Text = message.Body };

                using (var client = new SmtpClient())
                {
                    client.LocalDomain = "localhost";
                    await client.ConnectAsync(_appSettings.EmailServer.ServerSmtp, _appSettings.EmailServer.Port).ConfigureAwait(false);
                    client.AuthenticationMechanisms.Remove("XOAUTH2");
                    client.Authenticate(_appSettings.EmailServer.UserName, "PassWord");
                    await client.SendAsync(emailMessage).ConfigureAwait(false);
                    await client.DisconnectAsync(true).ConfigureAwait(false);
                }
                message.Result.IsInProcess = false;
                message.Result.IsSended = true;

                return await Task.FromResult(message);
            }
            catch (Exception exception)
            {
                message.Result.IsInProcess = false;
                message.Result.Exception = exception;
                message.Result.IsSended = false;
                return await Task.FromResult(message);
            }
#else
            message.Result.IsSended = true;
            return await Task.FromResult(message);
#endif

        }

        public async Task SendAsync(IdentityMessage message)
        {
            await SendMailFromServerAsync(message.Destination, message.Subject, message.Body, null, true);
        }
    }
}
