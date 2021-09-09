using SPSSUploadTest.Models;
using System;
using System.Linq;
using System.Web.Mvc;
using System.Web.Security;

namespace SPSSUploadTest.Controllers
{
    public class AccountsController : Controller
    {
        SPSSTestEntities db = new SPSSTestEntities();
        // GET: Accounts
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult Login()
        {
            return View();
        }
        [HttpPost]
        public ActionResult Login(UserModel formData)
        {
            try
            {
                if (formData.UserName != "" && formData.UserPassword != "")
                {
                    bool isValidUser = db.LoginDetails.Any(x => x.UserName.ToLower() == formData.UserName.ToLower() && x.UserPassword.ToLower() == formData.UserPassword.ToLower());
                    if (isValidUser)
                    {
                        int z = 0;
                        FormsAuthentication.SetAuthCookie(formData.UserName, false);

                        LoginDetail login = new LoginDetail();
                        login = db.LoginDetails.Where(x => x.UserName.ToLower() == formData.UserName.ToLower() && x.UserPassword.ToLower() == formData.UserPassword.ToLower()).FirstOrDefault();
                        User user = new User();
                        user = db.Users.Where(x => x.Id == login.UserId).FirstOrDefault();
                        UserRoleMapping userRoleMapping = new UserRoleMapping();
                        userRoleMapping = db.UserRoleMappings.Where(x => x.UserId == login.UserId).FirstOrDefault();
                        string RoleName = (from x in db.UserRoleMappings join y in db.RoleMasters on x.RoleId equals y.Id where x.UserId == login.UserId select y.RoleName).FirstOrDefault();
                        Session["UserId"] = login.UserId ?? default(int);
                        Session["RoleName"] = RoleName;

                        Response.Cookies["UserId"].Value = login.UserId.ToString(); ;
                        Response.Cookies["RoleName"].Value = RoleName;
                        Response.Cookies["Name"].Value = user.Name;


                        return RedirectToAction("Home", "Home");
                    }
                    else
                    {
                        ModelState.AddModelError("Invalid Username or Password", "");
                    }
                }
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("Connectivity error occurred. Please contact administrator", "");
                return RedirectToAction("Login");
            }
            ModelState.AddModelError("", "Invalid Username or Password");
            return View();
        }
        public ActionResult Logout()
        {
            FormsAuthentication.SignOut();
            return RedirectToAction("Login");
        }
    }
}