using Common.tools;
using mkindergartenHeadManage.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Drawing;
using System.IO;
using System.Web;

namespace mkindergartenHeadManage.App_Code.Handler {
    public class SliderHandler : IndexHandler {

        //Const
        private readonly string SLIDER_FLODER = "slider";       //輪播圖片存放資料夾
        private readonly int SLIDER_FIXED_WIDTH = 1080;       //輪播圖片固定寬像素
        private readonly int SLIDER_FIXED_HEIGHT = 410;       //輪播圖片固定高像素
        private readonly string SLIDER_DEFAULT_BEGIN_DATE = "1900-01-01";       //輪播資訊預設上架日期
        private readonly string SLIDER_DEFAULT_END_DATE = "9999-12-31";       //輪播資訊預設下架日期
        private readonly string SLIDER_DEFAULT_BEGIN_TIME = "00:00:00";       //輪播資訊預設上架時間
        private readonly string SLIDER_DEFAULT_END_TIME = "23:59:59";       //輪播資訊預設下架時間

        /// <summary>
        /// 取得輪播資料清單
        /// </summary>
        public ResponseResultModel getSliderList() {
            string sqlComm = @" SELECT [EDIT_ID], [EDIT_TITLE], [EDIT_IMAGE], [EDIT_LINK], [EDIT_ISON], [EDIT_SORT],
                                [EDIT_BEG_DATE] = IIF(CAST([EDIT_BEG_DATE] AS date) = @EDIT_BEG_DATE, '', CAST(CAST([EDIT_BEG_DATE] AS date) AS char(10))),
                                [EDIT_END_DATE] = IIF(CAST([EDIT_END_DATE] AS date) = @EDIT_END_DATE, '', CAST(CAST([EDIT_END_DATE] AS date) AS char(10)))
                                FROM [dbo].[MKG_EDIT] WITH(NOLOCK)
                                WHERE [EDIT_COMPANY_ID] = 0 AND [EDIT_KIND_ID] = 1 AND [EDIT_DEL_FLAG] = 0
                                ORDER BY [EDIT_ISON] DESC, [EDIT_SORT] ASC, [EDIT_MODIFYDATE] DESC ";

            Dictionary<string, object> dicy = new Dictionary<string, object> {
                {"@EDIT_BEG_DATE", this.SLIDER_DEFAULT_BEGIN_DATE},
                {"@EDIT_END_DATE", this.SLIDER_DEFAULT_END_DATE}
            };

            using (SqlDataReader reader = base.dbTools.requestDBToDataReader(sqlComm, dicy)) {
                if (!base.dbTools.reqError) {
                    if (reader.HasRows) {
                        SliderDataModel resultModel = new SliderDataModel();
                        resultModel.recommand_image_width = this.SLIDER_FIXED_WIDTH;
                        resultModel.recommand_image_height = this.SLIDER_FIXED_HEIGHT;
                        resultModel.sliders = new List<SliderModel>();

                        try {
                            while (reader.Read()) {
                                SliderModel model = new SliderModel {
                                    id = reader.GetDecimal(0),
                                    title = reader.GetString(1),
                                    image = string.Format("{0}/{1}/{2}", Resources.Public.headImageServerPath, this.SLIDER_FLODER, reader.GetString(2)),
                                    link = reader.GetString(3),
                                    is_on = reader.GetInt32(4),
                                    sort = reader.GetInt32(5),
                                    begin_date = reader.GetString(6),
                                    end_date = reader.GetString(7)
                                };

                                resultModel.sliders.Add(model);
                            }

                            base.responseModel.result = 1;
                            base.responseModel.data = resultModel;
                        } catch (Exception ex) {        //取得資料庫欄位值失敗
                            base.responseModel.result = Convert.ToInt32(Resources.ResponseCode.dbException);
                            base.responseModel.message = ex.Message;
                        }

                    } else {        //無資料筆數
                        base.responseModel.result = 0;
                    }

                } else {        //資料庫要求失敗
                    base.responseModel.result = Convert.ToInt32(Resources.ResponseCode.dbException);
                    base.responseModel.message = base.dbTools.reqErrorText;
                }
            }

            return base.responseModel;
        }

        /// <summary>
        /// 處理輪播圖片資料上傳
        /// </summary>
        /// <param name="file">圖片資料</param>
        /// <param name="update_user">操作者帳號名稱</param>
        /// <remarks>上傳圖片檔案前，須先建立虛擬目錄資料夾</remarks>
        /// <returns>ResponseResultModel</returns>
        public ResponseResultModel uploadSliderImage(HttpPostedFileBase file, string update_user) {
            if (file != null) {
                string fileExt = Path.GetExtension(file.FileName);       //取得原始副檔名
                string newFileName = string.Concat(DateTime.Now.ToString("yyyyMMddHHmmss"), fileExt);       //新檔名
                List<object> responseList = sliderInfoWriteToDB(newFileName, update_user);

                if (responseList[0].Equals(1)) {

                    //上傳圖片的完整網站路徑
                    string uploadImagePath = string.Format("{0}/{1}/{2}/{3}", ((this.APPLICATION_PATH.Equals("/")) ? string.Empty : this.APPLICATION_PATH),
                                                                              Resources.Public.headImageServerPath,
                                                                              this.SLIDER_FLODER,
                                                                              newFileName);

                    try {
                        //改變圖檔寬高像素並存成實體檔
                        Bitmap responseBitMap = Utility.changeImageSize(file.InputStream, this.SLIDER_FIXED_WIDTH, this.SLIDER_FIXED_HEIGHT);
                        responseBitMap.Save(HttpContext.Current.Server.MapPath(uploadImagePath));
                        base.responseModel.result = 1;
                    } catch (Exception ex) {        //儲存實體檔失敗
                        base.responseModel.result = -1;
                        base.responseModel.message = ex.Message;
                    }

                } else {        //資料庫新增失敗
                    base.responseModel.result = Convert.ToInt32(Resources.ResponseCode.dbException);
                    base.responseModel.message = Convert.ToString(responseList[1]);
                }

            } else {        //無取得輪播圖片資訊
                base.responseModel.result = Convert.ToInt32(Resources.ResponseCode.paramsNull);
            }

            return base.responseModel;
        }

        /// <summary>
        /// 刪除輪播資料(假刪)
        /// </summary>
        /// <param name="model">輪播圖片資料模型</param>
        /// <param name="update_user">操作者帳號名稱</param>
        /// <returns>ResponseResultModel</returns>
        public ResponseResultModel deleteSlider(SliderModel model, string update_user) {
            if (model != null) {
                List<object> responseList = deleteSliderInDB(model, update_user);

                if (responseList[0].Equals(1)) {
                    base.responseModel.result = 1;
                } else if (responseList[0].Equals(0)) {        //無對應ID
                    base.responseModel.result = Convert.ToInt32(responseList[0]);
                } else {        //資料庫發生錯誤
                    base.responseModel.result = Convert.ToInt32(Resources.ResponseCode.dbException);
                    base.responseModel.message = Convert.ToString(responseList[1]);
                }

            } else {        //無取得輪播圖片資訊
                base.responseModel.result = Convert.ToInt32(Resources.ResponseCode.paramsNull);
            }

            return base.responseModel;
        }

        /// <summary>
        /// 修改輪播資料
        /// </summary>
        /// <param name="model">輪播圖片資料模型</param>
        /// <param name="update_user">操作者帳號名稱</param>
        /// <returns>ResponseResultModel</returns>
        public ResponseResultModel updateSlider(SliderModel model, string update_user) {
            if (model != null) {
                List<object> responseList = updateSliderInDB(model, update_user);

                if (responseList[0].Equals(1)) {
                    base.responseModel.result = 1;
                } else if (responseList[0].Equals(0)) {        //無對應ID
                    base.responseModel.result = Convert.ToInt32(responseList[0]);
                } else {        //資料庫發生錯誤
                    base.responseModel.result = Convert.ToInt32(Resources.ResponseCode.dbException);
                    base.responseModel.message = Convert.ToString(responseList[1]);
                }

            } else {        //無取得輪播圖片資訊
                base.responseModel.result = Convert.ToInt32(Resources.ResponseCode.paramsNull);
            }

            return base.responseModel;
        }

        /// <summary>
        /// 將輪播圖片資訊寫入資料庫
        /// </summary>
        /// <param name="fileName">檔案名稱</param>
        /// <param name="update_user">操作者帳號名稱</param>
        /// <returns>List<object></returns>
        private List<object> sliderInfoWriteToDB(string fileName, string update_user) {
            List<object> resultList = new List<object>();
            string sqlComm = @" INSERT INTO [dbo].[MKG_EDIT] ([EDIT_KIND_ID], [EDIT_IMAGE], [EDIT_UPDATE_USER])
                                VALUES (@EDIT_KIND_ID, @EDIT_IMAGE, @EDIT_UPDATE_USER) ";

            Dictionary<string, object> dicy = new Dictionary<string, object> {
                {"@EDIT_KIND_ID", 1},
                {"@EDIT_IMAGE", fileName},
                {"@EDIT_UPDATE_USER", update_user}
            };

            resultList.Add(base.dbTools.modifyDBData(sqlComm, dicy));
            if (base.dbTools.reqError) {     //資料庫錯誤
                resultList.Add(base.dbTools.reqErrorText);
            }

            return resultList;
        }

        /// <summary>
        /// 刪除資料庫內輪播圖片資訊(假刪)
        /// </summary>
        /// <param name="model">輪播資料</param>
        /// <param name="update_user">操作者帳號名稱</param>
        /// <returns>List<object></returns>
        private List<object> deleteSliderInDB(SliderModel model, string update_user) {
            List<object> resultList = new List<object>();
            string sqlComm = @" UPDATE [dbo].[MKG_EDIT] SET [EDIT_DEL_FLAG] = 1, [EDIT_MODIFYDATE] = GETDATE(),
                                [EDIT_UPDATE_USER] = @EDIT_UPDATE_USER WHERE [EDIT_ID] = @EDIT_ID ";
            Dictionary<string, object> dicy = new Dictionary<string, object> {
                {"@EDIT_ID", model.id},
                {"@EDIT_UPDATE_USER", update_user}
            };

            resultList.Add(base.dbTools.modifyDBData(sqlComm, dicy));
            if (base.dbTools.reqError) {     //資料庫錯誤
                resultList.Add(base.dbTools.reqErrorText);
            }

            return resultList;
        }

        /// <summary>
        /// 更新資料庫內輪播資料
        /// </summary>
        /// <param name="model">輪播資料</param>
        /// <param name="update_user">操作者帳號名稱</param>
        /// <returns>List<object></returns>
        private List<object> updateSliderInDB(SliderModel model, string update_user) {
            List<object> resultList = new List<object>();
            string sqlComm = @" UPDATE [dbo].[MKG_EDIT] SET [EDIT_TITLE] = @EDIT_TITLE, [EDIT_LINK] = @EDIT_LINK,
                                [EDIT_ISON] = @EDIT_ISON, [EDIT_SORT] = @EDIT_SORT, [EDIT_MODIFYDATE] = GETDATE(),
                                [EDIT_BEG_DATE] = @EDIT_BEG_DATE, [EDIT_END_DATE] = @EDIT_END_DATE,
                                [EDIT_UPDATE_USER] = @EDIT_UPDATE_USER WHERE [EDIT_ID] = @EDIT_ID ";
            Dictionary<string, object> dicy = new Dictionary<string, object> {
                {"@EDIT_TITLE", ((!string.IsNullOrEmpty(model.title)) ? model.title : string.Empty)},
                {"@EDIT_LINK", ((!string.IsNullOrEmpty(model.link)) ? model.link : string.Empty)},
                {"@EDIT_ISON", model.is_on},
                {"@EDIT_SORT", model.sort},
                {"@EDIT_ID", model.id},
                {"@EDIT_BEG_DATE", string.Concat(((string.IsNullOrEmpty(model.begin_date)) ? this.SLIDER_DEFAULT_BEGIN_DATE : model.begin_date),
                    "T",
                    this.SLIDER_DEFAULT_BEGIN_TIME)},
                {"@EDIT_END_DATE", string.Concat(((string.IsNullOrEmpty(model.end_date)) ? this.SLIDER_DEFAULT_END_DATE : model.end_date),
                    "T",
                    this.SLIDER_DEFAULT_END_TIME)},
                {"@EDIT_UPDATE_USER", update_user}
            };

            resultList.Add(base.dbTools.modifyDBData(sqlComm, dicy));
            if (base.dbTools.reqError) {     //資料庫錯誤
                resultList.Add(base.dbTools.reqErrorText);
            }

            return resultList;
        }
    }
}