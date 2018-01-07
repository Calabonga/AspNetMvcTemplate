namespace AspNetMvcTemplate.Web.Infrastructure.MicroServices.EmailService
{
    /// <summary>
    /// Mail message interface
    /// </summary>
    public interface IMailMessage
    {
        string MailTo { get; set; }

        string MailFrom { get; set; }

        string Subject { get; set; }

        string Body { get; set; }
    }
}