using mkindergartenHeadManage.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace mkindergartenHeadManage.App_Code.Handler {
    public class JobHandler : IndexHandler {

        /// <summary>
        /// 依據城市編號取得所屬區域園所資料
        /// </summary>
        /// <param name="city_id">城市編號</param>
        /// <returns>ResponseResultModel</returns>
        public ResponseResultModel getCompanysByCity(Decimal city_id) {

            string sqlComm = @" SELECT [COMPANY_ID], [COMPANY_NAME] FROM [dbo].[MKG_COMPANY] WITH(NOLOCK)
                                WHERE [COMPANY_CITY] = IIF(@COMPANY_CITY > 0, @COMPANY_CITY, [COMPANY_CITY])
                                AND [COMPANY_DEL_FLAG] = 0 ";

            Dictionary<string, object> dicy = new Dictionary<string, object> {
                {"@COMPANY_CITY", city_id}
            };

            using (SqlDataReader reader = this.dbTools.requestDBToDataReader(sqlComm, dicy)) {
                try {
                    if (reader.HasRows) {
                        if (!this.dbTools.reqError) {
                            List<CompanyModel> companysList = new List<CompanyModel>();

                            while (reader.Read()) {
                                CompanyModel model = new CompanyModel {
                                    company_id = reader.GetDecimal(0),
                                    name = reader.GetString(1)
                                };

                                companysList.Add(model);
                            }

                            responseModel.result = 1;
                            responseModel.data = companysList;

                        } else {        //存取資料庫失敗
                            responseModel.result = Convert.ToInt32(Resources.ResponseCode.dbException);
                            responseModel.message = this.dbTools.reqErrorText;
                        }

                    } else {        //無取得園所資料
                        responseModel.result = 0;
                    }

                } catch (Exception ex) {        //存取資料庫失敗
                    responseModel.result = Convert.ToInt32(Resources.ResponseCode.dbException);
                    responseModel.message = ex.Message;
                }
            }

            return base.responseModel;
        }

        /// <summary>
        /// 依據園所編號取得尚未建立的職缺種類資料
        /// </summary>
        /// <param name="company_id">園所編號</param>
        /// <returns>ResponseResultModel</returns>
        public ResponseResultModel getJobKindsByCompany(Decimal company_id) {

            string sqlComm = @" SELECT [JOB_KIND_ID], [JOB_KIND_NAME] FROM [dbo].[MKG_JOB_KIND] WITH(NOLOCK)
                                WHERE [JOB_KIND_ID] NOT IN
                                (SELECT [JOB_KIND_ID] FROM [dbo].[MKG_JOB] WITH(NOLOCK)
                                WHERE [JOB_COMPANY_ID] = @JOB_COMPANY_ID AND [JOB_DEL_FLAG] = 0) ";

            Dictionary<string, object> dicy = new Dictionary<string, object> {
                {"@JOB_COMPANY_ID", company_id}
            };

            using (SqlDataReader reader = this.dbTools.requestDBToDataReader(sqlComm, dicy)) {
                try {
                    if (reader.HasRows) {
                        if (!this.dbTools.reqError) {
                            List<JobKindModel> jobsList = new List<JobKindModel>();

                            while (reader.Read()) {
                                JobKindModel model = new JobKindModel {
                                    job_kind_id = reader.GetDecimal(0),
                                    job_kind_name = reader.GetString(1)
                                };

                                jobsList.Add(model);
                            }

                            responseModel.result = 1;
                            responseModel.data = jobsList;

                        } else {        //存取資料庫失敗
                            responseModel.result = Convert.ToInt32(Resources.ResponseCode.dbException);
                            responseModel.message = this.dbTools.reqErrorText;
                        }

                    } else {        //無取得園所資料
                        responseModel.result = 0;
                    }

                } catch (Exception ex) {        //存取資料庫失敗
                    responseModel.result = Convert.ToInt32(Resources.ResponseCode.dbException);
                    responseModel.message = ex.Message;
                }
            }

            return base.responseModel;
        }

        /// <summary>
        /// 取得所有園所職缺清單
        /// </summary>
        /// <param name="company_id">園所編號</param>
        /// <returns>ResponseResultModel</returns>
        public ResponseResultModel getAllCompanyJobList(QueryCompanyJobsModel model) {

            string sqlComm = @" SELECT j.[JOB_ID], jk.[JOB_KIND_NAME], c.[COMPANY_NAME], c.[COMPANY_TEL],
                                [COMPANY_ADDRESS] = CONCAT(city.[CITY_NAME], c.[COMPANY_ADD])
                                FROM [dbo].[MKG_JOB] AS j WITH(NOLOCK)
                                JOIN [dbo].[MKG_JOB_KIND] AS jk WITH(NOLOCK)
                                ON j.[JOB_KIND_ID] = jk.[JOB_KIND_ID]
                                JOIN [dbo].[MKG_COMPANY] AS c WITH(NOLOCK)
                                ON j.[JOB_COMPANY_ID] = c.[COMPANY_ID]
                                JOIN [dbo].[MKG_CITY] AS city WITH(NOLOCK)
                                ON c.[COMPANY_CITY] = city.[CITY_ID]
                                WHERE c.[COMPANY_CITY] = IIF(@COMPANY_CITY > 0, @COMPANY_CITY, c.[COMPANY_CITY])
                                AND c.[COMPANY_ID] = IIF(@COMPANY_ID > 0, @COMPANY_ID, c.[COMPANY_ID])
                                AND j.[JOB_DEL_FLAG] = 0
                                ORDER BY [JOB_COMPANY_ID] ";

            Dictionary<string, object> dicy = new Dictionary<string, object> {
                {"@COMPANY_CITY", model.city_id},
                {"@COMPANY_ID", model.company_id}
            };

            using (SqlDataReader reader = this.dbTools.requestDBToDataReader(sqlComm, dicy)) {
                try {
                    if (reader.HasRows) {
                        if (!this.dbTools.reqError) {
                            List<CompanyJobModel> companyJobsList = new List<CompanyJobModel>();

                            while (reader.Read()) {
                                CompanyJobModel companyJobModel = new CompanyJobModel {
                                    job_id = reader.GetDecimal(0),
                                    job_kind_name = reader.GetString(1),
                                    company_name = reader.GetString(2),
                                    company_tel = reader.GetString(3),
                                    company_address = reader.GetString(4)
                                };

                                companyJobsList.Add(companyJobModel);
                            }

                            responseModel.result = 1;
                            responseModel.data = companyJobsList;

                        } else {        //存取資料庫失敗
                            responseModel.result = Convert.ToInt32(Resources.ResponseCode.dbException);
                            responseModel.message = this.dbTools.reqErrorText;
                        }

                    } else {        //無取得園所資料
                        responseModel.result = 0;
                    }

                } catch (Exception ex) {        //存取資料庫失敗
                    responseModel.result = Convert.ToInt32(Resources.ResponseCode.dbException);
                    responseModel.message = ex.Message;
                }
            }

            return base.responseModel;
        }

        /// <summary>
        /// 新增園所職缺資訊
        /// </summary>
        /// <param name="model">園所職缺資料模型</param>
        /// <param name="update_user">操作者帳號名稱</param>
        /// <returns>ResponseResultModel</returns>
        public ResponseResultModel addCompanyJob(addCompanyJobModel model, string update_user) {
            if (model != null) {
                List<object> responseList = addCompanyJobWriteInDB(model, update_user);
                base.responseModel.result = Convert.ToInt32(responseList[0]);

                if (responseList[0].Equals(-1)) {       //存取資料庫發生錯誤
                    base.responseModel.result = Convert.ToInt32(Resources.ResponseCode.dbException);
                    base.responseModel.message = Convert.ToString(responseList[1]);
                }

            } else {        //無取得園所職缺資料
                base.responseModel.result = Convert.ToInt32(Resources.ResponseCode.paramsNull);
            }

            return base.responseModel;
        }

        /// <summary>
        /// 刪除園所職缺資訊
        /// </summary>
        /// <param name="job_id">園所職缺資料編號</param>
        /// <param name="update_user">操作者帳號名稱</param>
        /// <returns>ResponseResultModel</returns>
        public ResponseResultModel deleteCompanyJob(Decimal job_id, string update_user) {
            List<object> responseList = deleteCompanyJobInDB(job_id, update_user);
            base.responseModel.result = Convert.ToInt32(responseList[0]);       //1 or 0

            if (responseList[0].Equals(-1)) {       //存取資料庫發生錯誤
                base.responseModel.result = Convert.ToInt32(Resources.ResponseCode.dbException);
                base.responseModel.message = Convert.ToString(responseList[1]);
            }

            return base.responseModel;
        }

        /// <summary>
        /// 將新增園所職缺資料寫入資料庫
        /// </summary>
        /// <param name="model">園所職缺資料模型</param>
        /// <param name="update_user">操作者帳號名稱</param>
        /// <returns>List<object></returns>
        private List<object> addCompanyJobWriteInDB(addCompanyJobModel model, string update_user) {
            List<object> resultList = new List<object>();
            string sqlComm = @" INSERT INTO [dbo].[MKG_JOB] ([JOB_KIND_ID], [JOB_COMPANY_ID], [JOB_UPDATE_USER])
                                VALUES (@JOB_KIND_ID, @JOB_COMPANY_ID, @JOB_UPDATE_USER) ";

            Dictionary<string, object> dicy = new Dictionary<string, object> {
                {"@JOB_KIND_ID", model.job_kind_id},
                {"@JOB_COMPANY_ID", model.company_id},
                {"@JOB_UPDATE_USER", update_user}
            };

            resultList.Add(base.dbTools.modifyDBData(sqlComm, dicy));
            if (base.dbTools.reqError) {
                resultList.Add(base.dbTools.reqErrorText);
            }

            return resultList;
        }

        /// <summary>
        /// 將資料庫園所職缺刪除
        /// </summary>
        /// <param name="job_id">園所職缺資料編號</param>
        /// <param name="update_user">操作者帳號名稱</param>
        /// <returns>List<object></returns>
        private List<object> deleteCompanyJobInDB(Decimal job_id, string update_user) {
            List<object> resultList = new List<object>();
            string sqlComm = @" UPDATE [dbo].[MKG_JOB] SET [JOB_DEL_FLAG] = 1, [JOB_UPDATE_USER] = @JOB_UPDATE_USER
                                WHERE [JOB_ID] = @JOB_ID ";

            Dictionary<string, object> dicy = new Dictionary<string, object> {
                {"@JOB_ID", job_id},
                {"@JOB_UPDATE_USER", update_user}
            };

            resultList.Add(base.dbTools.modifyDBData(sqlComm, dicy));
            if (base.dbTools.reqError) {
                resultList.Add(base.dbTools.reqErrorText);
            }

            return resultList;
        }
    }
}