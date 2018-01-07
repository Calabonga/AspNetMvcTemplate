using System.Web.Mvc;

namespace AspNetMvcTemplate.Web.Controllers
{

    /// <summary>
    /// Error handling controller
    /// </summary>
    public class ErrorsController : Controller
    {
        public ActionResult Http404()
        {
            return View();
        }

        public ActionResult General()
        {
            return View();
        }
    }
}
