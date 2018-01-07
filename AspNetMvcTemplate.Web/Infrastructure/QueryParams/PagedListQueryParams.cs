using Calabonga.OperationResults;

namespace AspNetMvcTemplate.Web.Infrastructure.QueryParams {

    /// <summary>
    /// QueryParams for PagedList
    /// </summary>
    public class PagedListQueryParams : PagedListQueryParamsBase {

        public PagedListQueryParams() {
            PageIndex = 1;
            PageSize = 10;
        }
    }
}