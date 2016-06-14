using mkindergartenHeadManage.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace mkindergartenHeadManage.App_Code.Handler {
    public class CompanyHandler : IndexHandler {

        /// <summary>
        /// 取得園所資料清單
        /// </summary>
        /// <param name="model">查詢園所資料清單參數模型</param>
        /// <returns>ResponseResultModel</returns>
        public ResponseResultModel getCompanyList(QueryCompanysModel model) {
            string sqlComm = @" SELECT c.[COMPANY_ID], c.[COMPANY_NAME], c.[COMPANY_CITY], c.[COMPANY_ADD], c.[COMPANY_TEL],
                                c.[COMPANY_YOUTUBE_PLAYLIST], c.[COMPANY_ISON], c.[COMPANY_CONTANT_LAT], c.[COMPANY_CONTANT_LNG],
                                u.[USER_ID], u.[USER_LOGIN_PWD],
                                [USER_LOGIN_ACN] = CONCAT('TMR', ISNULL(REPLICATE('0', 4 - LEN(c.[COMPANY_ID])), ''),
                                c.[COMPANY_ID], u.[USER_ID]), c.[COMPANY_MANAGER]
                                FROM [dbo].[MKG_COMPANY] AS c WITH(NOLOCK)
                                JOIN [dbo].[MKG_USER] AS u WITH(NOLOCK)
                                ON c.[COMPANY_ID] = u.[USER_COMPANY_ID]
                                WHERE c.[COMPANY_CITY] = IIF(@COMPANY_CITY > 0, @COMPANY_CITY, c.[COMPANY_CITY])
                                AND c.[COMPANY_ISON] = IIF(@COMPANY_ISON > -1, @COMPANY_ISON, c.[COMPANY_ISON])
                                AND c.[COMPANY_DEL_FLAG] = 0
                                ORDER BY c.[COMPANY_CITY], c.[COMPANY_ID] DESC ";

            Dictionary<string, object> dicy = new Dictionary<string, object> { 
                {"@COMPANY_CITY", model.city_id},
                {"@COMPANY_ISON", model.is_on}
            };

            using (SqlDataReader reader = base.dbTools.requestDBToDataReader(sqlComm, dicy)) {
                if (!base.dbTools.reqError) {
                    List<CompanyModel> resultList = new List<CompanyModel>();

                    try {
                        if (reader.HasRows) {
                            while (reader.Read()) {
                                CompanyModel companyDataModel = new CompanyModel {
                                    company_id = reader.GetDecimal(0),
                                    name = reader.GetString(1),
                                    city_id = reader.GetDecimal(2),
                                    add = reader.GetString(3),
                                    tel = reader.GetString(4),
                                    youtube_playlist = reader.GetString(5),
                                    is_on = reader.GetInt32(6),
                                    lat = reader.GetString(7),
                                    lng = reader.GetString(8),
                                    user_id = reader.GetDecimal(9),
                                    pwd = reader.GetString(10),
                                    acn = reader.GetString(11),
                                    manager = reader.GetString(12)
                                };

                                resultList.Add(companyDataModel);
                            }

                            base.responseModel.data = resultList;
                            base.responseModel.result = 1;
                        } else {
                            base.responseModel.result = 0;
                        }

                    } catch (Exception ex) {        //reader讀取失敗
                        base.responseModel.result = Convert.ToInt32(Resources.ResponseCode.dbException);
                        base.responseModel.message = ex.Message;
                    }

                } else {        //資料庫存取失敗
                    base.responseModel.result = Convert.ToInt32(Resources.ResponseCode.dbException);
                    base.responseModel.message = base.dbTools.reqErrorText;
                }
            }

            return base.responseModel;
        }

        /// <summary>
        /// 新增園所處理
        /// </summary>
        /// <param name="model">新增園所資料參數模型</param>
        /// <param name="update_user">操作者帳號名稱</param>
        /// <returns>ResponseResultModel</returns>
        public ResponseResultModel addCompany(CompanyModel model, string update_user) {
            if (model != null) {
                List<object> responseList = companyInfoWriteToDB(model, update_user);
                base.responseModel.result = Convert.ToInt32(responseList[0]);       //1：成功、-1：預存程序邏輯錯誤、-99：預存程序呼叫失敗
                base.responseModel.message = Convert.ToString(responseList[1]);

                if (!responseList[0].Equals(Resources.ResponseCode.dbException)) {      //預存程序呼叫成功
                    base.responseModel.data = new AddCompanyResultModel {
                        login_acn = Convert.ToString(responseList[2]),
                        login_pwd = Convert.ToString(responseList[3])
                    };
                }

            } else {        //無取得園所資料
                base.responseModel.result = Convert.ToInt32(Resources.ResponseCode.paramsNull);
            }

            return base.responseModel;
        }

        /// <summary>
        /// 修改園所處理
        /// </summary>
        /// <param name="model">修改園所資料參數模型</param>
        /// <param name="update_user">操作者帳號名稱</param>
        /// <returns>ResponseResultModel</returns>
        public ResponseResultModel updateCompany(CompanyModel model, string update_user) {
            if (model != null) {
                List<object> responseList = companyInfoUpdateToDB(model, update_user);

                if (Convert.ToInt32(responseList[0]) > 0) {
                    base.responseModel.result = 1;
                } else if (responseList[0].Equals(0)) {     //無對應ID
                    base.responseModel.result = Convert.ToInt32(responseList[0]);
                } else {        //資料庫存取失敗
                    base.responseModel.result = Convert.ToInt32(Resources.ResponseCode.dbException);
                    base.responseModel.message = Convert.ToString(responseList[1]);
                }

            } else {        //無取得園所資料
                base.responseModel.result = Convert.ToInt32(Resources.ResponseCode.paramsNull);
            }

            return base.responseModel;
        }

        /// <summary>
        /// 刪除園所處理
        /// </summary>
        /// <param name="model">刪除園所資料參數模型</param>
        /// <param name="update_user">操作者帳號名稱</param>
        /// <returns>ResponseResultModel</returns>
        public ResponseResultModel deleteCompany(CompanyModel model, string update_user) {
            if (model != null) {
                List<object> responseList = companyInfoDeleteToDB(model, update_user);

                if (Convert.ToInt32(responseList[0]) > 0) {
                    base.responseModel.result = 1;
                } else if (responseList[0].Equals(0)) {     //無對應ID
                    base.responseModel.result = Convert.ToInt32(responseList[0]);
                } else {        //資料庫存取失敗
                    base.responseModel.result = Convert.ToInt32(Resources.ResponseCode.dbException);
                    base.responseModel.message = Convert.ToString(responseList[1]);
                }

            } else {        //無取得園所資料
                base.responseModel.result = Convert.ToInt32(Resources.ResponseCode.paramsNull);
            }

            return base.responseModel;
        }

        /// <summary>
        /// 將園所資料寫入資料庫並回傳結果
        /// </summary>
        /// <param name="model">新增園所資料參數模型</param>
        /// <param name="user">操作者帳號名稱</param>
        /// <returns>List<object></returns>
        private List<object> companyInfoWriteToDB(CompanyModel model, string update_user) {

            List<object> resultList = new List<object>();

            //預存程序輸出參數
            SqlParameter result = new SqlParameter("@result", SqlDbType.Int);
            result.Direction = ParameterDirection.Output;
            SqlParameter err_msg = new SqlParameter("@err_msg", SqlDbType.NVarChar, 500);
            err_msg.Direction = ParameterDirection.Output;
            SqlParameter login_acn = new SqlParameter("@login_acn", SqlDbType.VarChar, 10);
            login_acn.Direction = ParameterDirection.Output;
            SqlParameter login_pwd = new SqlParameter("@login_pwd", SqlDbType.VarChar, 10);
            login_pwd.Direction = ParameterDirection.Output;

            //預存程序輸入輸出參數
            List<SqlParameter> sqlParamList = new List<SqlParameter> {
                new SqlParameter("@name", model.name),
                new SqlParameter("@city", model.city_id),
                new SqlParameter("@add", model.add),
                new SqlParameter("@tel", model.tel),
                new SqlParameter("@youtube_play_list", model.youtube_playlist),
                new SqlParameter("@lat", model.lat),
                new SqlParameter("@lng", model.lng),
                new SqlParameter("@manager", model.manager),
                new SqlParameter("@update_user", update_user),
                result,
                err_msg,
                login_acn,
                login_pwd
            };

            //執行預存程序取得結果
            base.dbTools.useStoredProdure("[dbo].[USP_addCompanyInfo]", sqlParamList.ToArray());

            if (!base.dbTools.reqError) {
                resultList.Add(result.Value);
                resultList.Add(err_msg.Value);
                resultList.Add(login_acn.Value);
                resultList.Add(login_pwd.Value);
            } else {        //預存程序呼叫失敗
                resultList.Add(Resources.ResponseCode.dbException);
                resultList.Add(base.dbTools.reqErrorText);
            }

            return resultList;
        }

        /// <summary>
        /// 修改資料庫園所資料並回傳結果
        /// </summary>
        /// <param name="model">修改園所資料參數模型</param>
        /// <param name="update_user">操作者帳號名稱</param>
        /// <returns></returns>
        private List<object> companyInfoUpdateToDB(CompanyModel model, string update_user) {
            List<object> resultList = new List<object>();
            string sqlComm = @" UPDATE [dbo].[MKG_COMPANY] SET [COMPANY_CITY] = @COMPANY_CITY, [COMPANY_ADD] = @COMPANY_ADD,
                                [COMPANY_TEL] = @COMPANY_TEL, [COMPANY_YOUTUBE_PLAYLIST] = @COMPANY_YOUTUBE_PLAYLIST,
                                [COMPANY_ISON] = @COMPANY_ISON, [COMPANY_MODIFYDATE] = GETDATE(), [COMPANY_MANAGER] = @COMPANY_MANAGER,
                                [COMPANY_UPDATE_USER] = @UPDATE_USER, [COMPANY_CONTANT_LAT] = @COMPANY_CONTANT_LAT,
                                [COMPANY_CONTANT_LNG] = @COMPANY_CONTANT_LNG
                                WHERE [COMPANY_ID] = @COMPANY_ID
                                ;UPDATE [dbo].[MKG_USER] SET [USER_LOGIN_PWD] = @USER_LOGIN_PWD, [USER_MODIFYDATE] = GETDATE(),
                                [USER_UPDATE_USER] = @UPDATE_USER
                                WHERE [USER_ID] = @USER_ID ";

            Dictionary<string, object> dicy = new Dictionary<string, object> { 
                {"@COMPANY_CITY", model.city_id},
                {"@COMPANY_ADD", model.add},
                {"@COMPANY_TEL", ((!string.IsNullOrEmpty(model.tel)) ? model.tel : string.Empty)},
                {"@COMPANY_YOUTUBE_PLAYLIST", ((!string.IsNullOrEmpty(model.youtube_playlist)) ? model.youtube_playlist : string.Empty)},
                {"@COMPANY_ISON", model.is_on},
                {"@COMPANY_ID", model.company_id},
                {"@COMPANY_MANAGER", ((!string.IsNullOrEmpty(model.manager)) ? model.manager : string.Empty)},
                {"@USER_LOGIN_PWD", model.pwd},
                {"@USER_ID", model.user_id},
                {"@UPDATE_USER", update_user},
                {"@COMPANY_CONTANT_LAT", model.lat},
                {"@COMPANY_CONTANT_LNG", model.lng}
            };

            resultList.Add(base.dbTools.modifyDBData(sqlComm, dicy));
            if (base.dbTools.reqError) {        //資料庫存取發生錯誤
                resultList.Add(base.dbTools.reqErrorText);
            }

            return resultList;
        }

        /// <summary>
        /// 刪除資料庫園所資料並回傳結果(假刪)
        /// </summary>
        /// <param name="model">刪除園所資料參數模型</param>
        /// <param name="update_user">操作者帳號名稱</param>
        /// <returns></returns>
        private List<object> companyInfoDeleteToDB(CompanyModel model, string update_user) {
            List<object> resultList = new List<object>();
            string sqlComm = @" UPDATE [dbo].[MKG_COMPANY] SET [COMPANY_DEL_FLAG] = 1, [COMPANY_UPDATE_USER] = @UPDATE_USER
                                WHERE [COMPANY_ID] = @COMPANY_ID
                                ;UPDATE [dbo].[MKG_USER] SET [USER_DEL_FLAG] = 1, [USER_UPDATE_USER] = @UPDATE_USER
                                WHERE [USER_ID] = @USER_ID
                                ;UPDATE [dbo].[MKG_JOB] SET [JOB_DEL_FLAG] = 1, [JOB_UPDATE_USER] = @UPDATE_USER
                                WHERE [JOB_COMPANY_ID] = @COMPANY_ID ";

            Dictionary<string, object> dicy = new Dictionary<string, object> { 
                {"@COMPANY_ID", model.company_id},
                {"@USER_ID", model.user_id},
                {"@UPDATE_USER", update_user}
            };

            resultList.Add(base.dbTools.modifyDBData(sqlComm, dicy));
            if (base.dbTools.reqError) {        //資料庫存取發生錯誤
                resultList.Add(base.dbTools.reqErrorText);
            }

            return resultList;
        }
    }
}