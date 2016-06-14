using Common.tools;
using mkindergartenHeadManage.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Web;

namespace mkindergartenHeadManage.App_Code.Handler {
    public class IndexHandler {

        protected ResponseResultModel responseModel = new ResponseResultModel();      //回應伺服器處理結果模型
        protected DBTools dbTools = new DBTools(ConfigurationManager.ConnectionStrings["connStr_MKG"].ToString());

        //const
        protected readonly string APPLICATION_PATH = HttpContext.Current.Request.ApplicationPath;       //應用程式路徑

        /// <summary>
        /// 取得所有城市資料
        /// </summary>
        public ResponseResultModel getAllCitys() {
            string sqlComm = @" SELECT * FROM [dbo].[MKG_CITY] ";

            using (SqlDataReader reader = this.dbTools.requestDBToDataReader(sqlComm)) {
                try {
                    if (reader.HasRows) {
                        if (!this.dbTools.reqError) {
                            List<CityModel> citysList = new List<CityModel>();

                            while (reader.Read()) {
                                CityModel model = new CityModel {
                                    id = reader.GetDecimal(0),
                                    name = reader.GetString(1)
                                };

                                citysList.Add(model);
                            }

                            responseModel.result = 1;
                            responseModel.data = citysList;

                        } else {        //存取資料庫失敗
                            responseModel.result = Convert.ToInt32(Resources.ResponseCode.dbException);
                            responseModel.message = this.dbTools.reqErrorText;
                        }

                    } else {
                        responseModel.result = 0;
                    }

                } catch (Exception ex) {        //存取資料庫失敗
                    responseModel.result = Convert.ToInt32(Resources.ResponseCode.dbException);
                    responseModel.message = ex.Message;
                }

            }

            return this.responseModel;
        }
    }
}