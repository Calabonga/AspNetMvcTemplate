namespace AspNetMvcTemplate.Web.Infrastructure.MicroServices.EmailService {
    /// <summary>
    /// Mail Message to send
    /// </summary>
    public class MailMessage : IMailMessage {

        public MailMessage() {
            Result = new SendResult();
        }

        public string MailTo { get; set; }

        public string Subject { get; set; }

        public string Body { get; set; }

        public SendResult Result { get; }

        public bool IsHtml { get; set; }
        public string MailFrom { get; set; }
    }
}
