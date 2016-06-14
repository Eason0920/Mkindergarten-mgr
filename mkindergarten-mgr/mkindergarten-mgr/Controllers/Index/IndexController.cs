using mkindergartenHeadManage.App_Code.Handler;
using mkindergartenHeadManage.Models;
using System;
using System.Web;
using System.Web.Mvc;

namespace mkindergartenHeadManage.Controllers {
    public class IndexController : Controller {

        public ActionResult Index() {
            return View();
        }

        #region *** 通用資料要求 ***

        /// <summary>
        /// 取得所有城市名稱編號資料
        /// </summary>
        /// <returns>ResponseResultModel</returns>
        [HttpGet]
        public ActionResult getAllCitysAction() {
            ResponseResultModel responseModel = new IndexHandler().getAllCitys();
            return Json(responseModel, JsonRequestBehavior.AllowGet);
        }

        #endregion

        #region *** 輪播圖片設定 ***

        /// <summary>
        /// 取得輪播資料
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ActionResult getSliderListAction() {
            ResponseResultModel responseModel = new SliderHandler().getSliderList();
            return Json(responseModel, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 上傳輪播圖片
        /// </summary>
        /// <param name="file">圖片資料</param>
        /// <param name="update_user">操作者帳號名稱</param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult uploadSliderImageAction(HttpPostedFileBase file, string update_user) {
            ResponseResultModel responseModel = new SliderHandler().uploadSliderImage(file, update_user);
            return Json(responseModel);
        }

        /// <summary>
        /// 刪除輪播資料
        /// </summary>
        /// <param name="model">輪播資料模型</param>
        /// <param name="update_user">操作者帳號名稱</param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult deleteSliderAction(SliderModel model, string update_user) {
            ResponseResultModel responseModel = new SliderHandler().deleteSlider(model, update_user);
            return Json(responseModel);
        }

        /// <summary>
        /// 更新輪播資料
        /// </summary>
        /// <param name="model">輪播資料模型</param>
        /// <param name="update_user">操作者帳號名稱</param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult updateSliderAction(SliderModel model, string update_user) {
            ResponseResultModel responseModel = new SliderHandler().updateSlider(model, update_user);
            return Json(responseModel);
        }

        #endregion

        #region *** 園所資訊維護 ***

        /// <summary>
        /// 取得園所資料清單
        /// </summary>
        /// <param name="model">查詢園所資料清單參數模型</param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult getCompanyListAction(QueryCompanysModel model) {
            ResponseResultModel responseModel = new CompanyHandler().getCompanyList(model);
            return Json(responseModel, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 新增園所資訊
        /// </summary>
        /// <param name="model">新增園所資料參數模型</param>
        /// <param name="update_user">操作者帳號名稱</param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult addCompanyAction(CompanyModel model, string update_user) {
            ResponseResultModel responseModel = new CompanyHandler().addCompany(model, update_user);
            return Json(responseModel);
        }

        /// <summary>
        /// 修改園所資訊
        /// </summary>
        /// <param name="model">修改園所資料參數模型</param>
        /// <param name="update_user">操作者帳號名稱</param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult updateCompanyAction(CompanyModel model, string update_user) {
            ResponseResultModel responseModel = new CompanyHandler().updateCompany(model, update_user);
            return Json(responseModel);
        }

        /// <summary>
        /// 刪除園所資訊
        /// </summary>
        /// <param name="model">刪除園所資料參數模型</param>
        /// <param name="update_user">操作者帳號名稱</param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult deleteCompanyAction(CompanyModel model, string update_user) {
            ResponseResultModel responseModel = new CompanyHandler().deleteCompany(model, update_user);
            return Json(responseModel);
        }

        #endregion

        #region *** 園所職缺維護 ***

        /// <summary>
        /// 依據城市編號取得所屬區域園所資料
        /// </summary>
        /// <param name="city_id">城市編號</param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult getCompanysByCityAction(Decimal city_id) {
            ResponseResultModel responseModel = new JobHandler().getCompanysByCity(city_id);
            return Json(responseModel, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 依據園所編號取得尚未建立的職缺種類資料
        /// </summary>
        /// <param name="company_id">園所編號</param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult getJobKindsByCompanyAction(Decimal company_id) {
            ResponseResultModel responseModel = new JobHandler().getJobKindsByCompany(company_id);
            return Json(responseModel, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 取得所有園所職缺清單
        /// </summary>
        /// <param name="model">取得所有園所職缺清單參數模型</param>
        /// <returns></returns>
        [HttpGet]
        public ActionResult getAllCompanyJobListAction(QueryCompanyJobsModel model) {
            ResponseResultModel responseModel = new JobHandler().getAllCompanyJobList(model);
            return Json(responseModel, JsonRequestBehavior.AllowGet);
        }

        /// <summary>
        /// 新增園所職缺資訊
        /// </summary>
        /// <param name="model">新增園所職缺參數模型</param>
        /// <param name="update_user">操作者帳號名稱</param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult addCompanyJobAction(addCompanyJobModel model, string update_user) {
            ResponseResultModel responseModel = new JobHandler().addCompanyJob(model, update_user);
            return Json(responseModel);
        }

        /// <summary>
        /// 刪除園所職缺資訊
        /// </summary>
        /// <param name="job_id">刪除園所職缺資料編號</param>
        /// <param name="update_user">操作者帳號名稱</param>
        /// <returns></returns>
        [HttpPost]
        public ActionResult deleteCompanyJobAction(Decimal job_id, string update_user) {
            ResponseResultModel responseModel = new JobHandler().deleteCompanyJob(job_id, update_user);
            return Json(responseModel);
        }

        #endregion
    }
}