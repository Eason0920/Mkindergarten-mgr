using mkindergartenHeadManage.Models;
using System;
using System.Collections.Generic;

namespace mkindergartenHeadManage.App_Code.Handler {

    public class LoginHandler : IndexHandler {

        /// <summary>
        /// 使用者登入驗證
        /// </summary>
        /// <param name="model">使用者登入資料模型</param>
        /// <returns>ResponseResultModel</returns>
        public ResponseResultModel loginSubmit(LoginModel model) {
            string sqlComm = @" IF EXISTS(SELECT * FROM [dbo].[MKG_USER] WITH(NOLOCK)
                                WHERE [USER_LOGIN_ID] = @USER_LOGIN_ID AND [USER_LOGIN_PWD] = @USER_LOGIN_PWD AND [USER_ISON] = 1)
                                SELECT 1 ELSE SELECT 0 ";

            Dictionary<string, object> dicy = new Dictionary<string, object> {
                {"@USER_LOGIN_ID", model.acn},
                {"@USER_LOGIN_PWD", model.pwd}
            };

            if (model != null) {
                object result = base.dbTools.requestDBWithSingle(sqlComm, dicy);

                if (!base.dbTools.reqError) {
                    base.responseModel.result = Convert.ToInt32(result);
                } else {        //資料庫要求失敗
                    base.responseModel.result = Convert.ToInt32(Resources.ResponseCode.dbException);
                    base.responseModel.message = base.dbTools.reqErrorText;
                }

            } else {        //無取得傳入參數資料
                base.responseModel.result = Convert.ToInt32(Resources.ResponseCode.paramsNull);
            }

            return base.responseModel;
        }
    }
}