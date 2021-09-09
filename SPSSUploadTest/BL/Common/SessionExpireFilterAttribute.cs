using System.Web;
using System.Web.Mvc;

namespace SPSSUploadTest.BL.Common
{
    public class SessionExpireFilterAttribute : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            HttpContext ctx = HttpContext.Current;
            int s = ctx.Session.Timeout;
            //if (ctx.Session["Name"] == null)
            //{
            //    filterContext.Result = new RedirectResult("~/Home/Index");
            //    return;
            //}
            //if (s == 0)
            //{
            //    filterContext.Result = new RedirectResult("~/Accounts/Login");
            //    return;
            //}

            var a = HttpContext.Current.Request.Cookies["USerID"].Value;


            if (a == null)
            {
                filterContext.Result = new RedirectResult("~/Accounts/Login");
                return;
            }


            base.OnActionExecuting(filterContext);
        }
    }
}