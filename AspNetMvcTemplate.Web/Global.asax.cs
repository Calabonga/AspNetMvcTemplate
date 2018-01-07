using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Routing;
using AspNetMvcTemplate.Web.Controllers;
using AspNetMvcTemplate.Web.Infrastructure;

namespace AspNetMvcTemplate.Web
{
    public class MvcApplication :HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            DependencyContainer.Initialize();
            Log4NetConfig.Initialize();
        }

        protected void Application_Error()
        {
            if (!HttpContext.Current.IsCustomErrorEnabled) return;
            var exception = Server.GetLastError();
            var httpException = exception as HttpException;
            Response.Clear();
            Server.ClearError();
            var routeData = new RouteData();
            routeData.Values["controller"] = "Errors";
            routeData.Values["action"] = "General";
            routeData.Values["exception"] = exception;
            Response.StatusCode = 500;
            if (httpException != null)
            {
                Response.StatusCode = httpException.GetHttpCode();
                switch (Response.StatusCode)
                {
                    case 403:
                        routeData.Values["action"] = "Http403";
                        break;

                    case 404:
                        routeData.Values["action"] = "Http404";
                        break;
                }
            }
            Response.TrySkipIisCustomErrors = true;
            IController errorsController = new ErrorsController();
            var wrapper = new HttpContextWrapper(Context);
            var requestContext = new RequestContext(wrapper, routeData);
            errorsController.Execute(requestContext);
        }
    }
}
