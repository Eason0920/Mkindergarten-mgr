using mkindergartenHeadManage.App_Code.Handler;
using mkindergartenHeadManage.Models;
using System.Web.Mvc;

namespace mkindergartenHeadManage.Controllers
{
    public class LoginController : Controller
    {
        // GET: Login
        public ActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// 使用者登入驗證
        /// </summary>
        /// <param name="model">使用者登入資料模型</param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult loginSubmitAction(LoginModel model) {
            ResponseResultModel resultModel = new LoginHandler().loginSubmit(model);
            return Json(resultModel);
        }
    }
}