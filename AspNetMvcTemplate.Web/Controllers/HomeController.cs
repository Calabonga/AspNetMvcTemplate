using System.Web.Mvc;
using AspNetMvcTemplate.Web.Infrastructure.Services;

namespace AspNetMvcTemplate.Web.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogService _logService;

        public HomeController(ILogService logService)
        {
            _logService = logService;
        }
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult About()
        {
            var message = "Your application description page.";
            ViewBag.Message = message;
            _logService.LogInfo(message);
            return View();
        }

        public ActionResult Contact()
        {
            ViewBag.Message = "Your contact page.";

            return View();
        }
    }
}