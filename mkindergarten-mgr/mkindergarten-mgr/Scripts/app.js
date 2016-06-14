var app = angular.module('app', ['ngFileUpload', 'toolsServiceModule', 'geoLocationServiceModule',
    'uiDirectiveModule', 'cgBusy', 'generalDirectiveModule', 'ngStorage']);

app.constant('APP_CONSTANT', {
    LOGIN_SUBMIT_ACTION: 'Login/loginSubmitAction',
    ALL_CITYS_ACTION: 'Index/getAllCitysAction',
    ALL_JOBS_KIND_ACTION: 'Index/getAllJobsKindAction',
    SLIDER_LIST_ACTION: 'Index/getSliderListAction',
    SLIDER_UPLOAD_ACTION: 'Index/uploadSliderImageAction',
    SLIDER_DELETE_ACTION: 'Index/deleteSliderAction',
    SLIDER_UPDATE_ACTION: 'Index/updateSliderAction',
    COMPANY_LIST_ACTION: 'Index/getCompanyListAction',
    ADD_COMPANY_ACTION: 'Index/addCompanyAction',
    UPDATE_COMPANY_ACTION: 'Index/updateCompanyAction',
    DELETE_COMPANY_ACTION: 'Index/deleteCompanyAction',
    GET_COMPANYS_BY_CITY_ACTION: 'Index/getCompanysByCityAction',
    GET_JOB_KINDS_BY_COMPANY_ACTION: 'Index/getJobKindsByCompanyAction',
    ALL_COMPANY_JOB_LIST_ACTION: 'Index/getAllCompanyJobListAction',
    ADD_COMPANY_JOB_ACTION: 'Index/addCompanyJobAction',
    DELETE_COMPANY_JOB_ACTION: 'Index/deleteCompanyJobAction',
    LOGIN_PAGE_APP_PATH: ((window.location.pathname.indexOf('mkids') > -1) ? '/mkids/login' : '/login'),
    INDEX_PAGE_APP_PATH: ((window.location.pathname.indexOf('mkids') > -1) ? '/mkids' : '/'),
    COMPANY_LIST_ONCE_COUNT: 10,        //園所資訊維護每分頁資料數量
    COMPANY_JOBS_LIST_ONCE_COUNT: 8     //園所職缺維護每分頁資料數量
});

//複寫 cgBusy 預設參數
app.value('cgBusyDefaults', {
    message: '處理中！請稍後 ...'
});

app.run(['$rootScope', 'appService', '$window', '$sessionStorage', 'APP_CONSTANT',
    function ($rootScope, appService, $window, $sessionStorage, APP_CONSTANT) {

        //#region *** 全域公用資料模型 ***
        
        //是否啟用選單資料模型
        $rootScope.isOnOpts = [
                { value: -1, label: '全部' },
                { value: 1, label: '已啟用' },
                { value: 0, label: '未啟用' }
        ];

        //判斷資料異動是否有儲存
        $rootScope.isDataModifyNotSave = false;

        //應用程式路徑名稱
        $rootScope.appPathName = $window.location.pathname;

        //利用 sessionStorage 判斷是否登入註記(若無 sessionStorage 則初始化為 0)
        $rootScope.logining = ((angular.isDefined($sessionStorage.logining)) ? $sessionStorage.logining : '');

        //#endregion

        //#region *** 全域公用函式 ***

        //排除城市選單'全部'選項
        $rootScope.excludeAllCityOption = function (data) {
            return data.id != 0;
        }

        //利用城市編號取得城市名稱
        $rootScope.getCityNameById = function (id) {
            var cityName = '';
            if ($rootScope.allCitys) {
                for (var idx in $rootScope.allCitys) {
                    if ($rootScope.allCitys[idx].id === id) {
                        cityName = $rootScope.allCitys[idx].name;
                        break;
                    }
                }
            }

            return cityName;
        }

        //#endregion

        //#region *** 應用程式首次啟動載入 ***

        //預先載入所有城市資料
        appService.getAllCitys()
            .then(function (response) {
                $rootScope.allCitys = response;

                //縣市選單加入"全部"選項
                $rootScope.allCitys.unshift({ id: 0, name: '全部' });
            }, function (response) {
                alert(response);
            });

        //監聽全域登入註記數值
        $rootScope.$watch('logining', function (newVal, oldVal) {
            $sessionStorage.logining = $rootScope.logining;

            //判斷目前頁面與是否有登入註記決定轉換的頁面位置
            if (newVal.length  === 0 && $window.location.pathname.indexOf('login') === -1) {        //內文頁面尚未登入
                $window.location.replace(APP_CONSTANT.LOGIN_PAGE_APP_PATH);
            } else if (newVal.length > 0 && $window.location.pathname.indexOf('login') > -1) {       //登入頁面已有登入
                $window.location.replace(APP_CONSTANT.INDEX_PAGE_APP_PATH);
            }
        });

        //#endregion

    }]);