namespace AspNetMvcTemplate.Web.Infrastructure.QueryParams
{
    /// <summary>
    /// QueryParams for Logs
    /// </summary>
    public class MessageLogPagedListQueryParams : PagedListQueryParams
    {
        public string Level { get; set; }

        public override string ToString()
        {
            return $"QueryParams-{PageIndex}-{PageSize}-{Search}";
        }
    }
}