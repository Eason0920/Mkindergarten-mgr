using System;
using System.Collections.Generic;

namespace mkindergartenHeadManage.Models {

    /// <summary>
    /// 回應伺服器結果模型
    /// </summary>
    public class ResponseResultModel {
        public int result { get; set; }
        public object data { get; set; }
        public string message { get; set; }
    }

    /// <summary>
    /// 登入帳號模型
    /// </summary>
    public class LoginModel {
        public string acn { get; set; }
        public string pwd { get; set; }
    }

    /// <summary>
    /// 城市資料模型
    /// </summary>
    public class CityModel {
        public Decimal id { get; set; }
        public string name { get; set; }
    }

    /// <summary>
    /// 輪播資訊清單模型
    /// </summary>
    public class SliderDataModel {
        public int recommand_image_width { get; set; }
        public int recommand_image_height { get; set; }
        public List<SliderModel> sliders { get; set; }
    }

    /// <summary>
    /// 輪播資料模型
    /// </summary>
    public class SliderModel {
        public Decimal id { get; set; }
        public string title { get; set; }
        public string image { get; set; }
        public string link { get; set; }
        public int is_on { get; set; }
        public int sort { get; set; }
        public string begin_date { get; set; }
        public string end_date { get; set; }
    }

    /// <summary>
    /// 園所資料模型
    /// </summary>
    public class CompanyModel {
        public Decimal company_id { get; set; }
        public Decimal user_id { get; set; }
        public string name { get; set; }
        public Decimal city_id { get; set; }
        public string add { get; set; }
        public string tel { get; set; }
        public string youtube_playlist { get; set; }
        public string lat { get; set; }
        public string lng { get; set; }
        public string acn { get; set; }
        public string pwd { get; set; }
        public int is_on { get; set; }
        public string manager { get; set; }
    }

    /// <summary>
    /// 新增園所資料回傳登入帳密資料模型
    /// </summary>
    public class AddCompanyResultModel {
        public string login_acn { get; set; }
        public string login_pwd { get; set; }
    }

    /// <summary>
    /// 查詢園所清單資料模型
    /// </summary>
    public class QueryCompanysModel {
        public Decimal city_id { get; set; }
        public Int32 is_on { get; set; }
    }

    /// <summary>
    /// 查詢園所職缺清單資料模型
    /// </summary>
    public class QueryCompanyJobsModel {
        public Decimal city_id { get; set; }
        public Decimal company_id { get; set; }
    }

    /// <summary>
    /// 園所職缺種類資料模型
    /// </summary>
    public class JobKindModel {
        public Decimal job_kind_id { get; set; }
        public string job_kind_name { get; set; }
    }

    /// <summary>
    /// 園所職缺資料模型
    /// </summary>
    public class CompanyJobModel {
        public Decimal job_id { get; set; }
        public string job_kind_name { get; set; }
        public string company_name { get; set; }
        public string company_tel { get; set; }
        public string company_address { get; set; }
    }

    /// <summary>
    /// 新增園所職缺資料模型
    /// </summary>
    public class addCompanyJobModel {
        public Decimal company_id { get; set; }
        public Decimal job_kind_id { get; set; }
    }
}