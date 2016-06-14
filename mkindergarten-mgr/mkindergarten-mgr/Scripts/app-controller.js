//登入頁面 controller
app.controller('loginCtrl', ['$scope', '$rootScope', 'APP_CONSTANT', 'ajax',
    function ($scope, $rootScope, APP_CONSTANT, ajax) {

        var inProc = false;

        //登入模型
        $scope.loginModel = {
            acn: null,
            pwd: null
        }

        //登入送出
        $scope.loginSubmit = function () {
            if (!inProc) {
                inProc = true;

                //伺服器處理
                $scope.isProcessing = ajax.post(APP_CONSTANT.LOGIN_SUBMIT_ACTION, { model: $scope.loginModel })
                    .then(function (response) {
                        if (response.status === 200) {
                            if (response.data.result === 1) {
                                $rootScope.logining = $scope.loginModel.acn;
                            } else if (response.data.result === 0) {
                                alert('【登入失敗！】\r\nresult: ' + response.data.result + '\r\nmessage: 使用者帳號或密碼錯誤');
                            } else if (response.data.result === -98) {        //伺服器資料處理失敗
                                alert('【登入失敗！】\r\nresult: ' + response.data.result + '\r\nmessage: 使用者登入資料參數遺失');
                            } else {
                                alert('【登入失敗！】\r\nresult: ' + response.data.result + '\r\nmessage: ' + response.data.message);
                            }
                        } else {        //網路傳輸失敗
                            alert('【登入失敗！】\r\nresult: ' + response.status + '\r\nmessage: ' + response.statusText);
                        }

                        inProc = false;
                    });
            }
        }
    }]);

//外層選單 controller
app.controller('indexCtrl', ['$scope', '$rootScope', 'appService', '$window', '$timeout',
    function ($scope, $rootScope, appService, $window, $timeout) {

        $scope.isLogout = false;        //登出註記
        $scope.includeHtml = (($rootScope.logining.length > 0) ? 'Html/slider-setting.html' : null);        //嵌入的 html 路徑

        //左方選單點擊
        $scope.menuClick = function (includeHtml) {

            //優先檢查儲存的帳號狀態
            appService.checkStorageStatus().then(function (user) {
                if (!angular.equals($scope.includeHtml, includeHtml)) {

                    //加入判斷是否資料有修改過且尚未儲存的提醒
                    if ($rootScope.isDataModifyNotSave) {
                        if ($window.confirm('您有修改資料【未儲存】！\r\n請確認是否離開？')) {

                            //全域資料異動註記，供離開頁面時提示判斷
                            $rootScope.isDataModifyNotSave = false;
                        } else {
                            return;
                        }
                    }

                    $scope.includeHtml = includeHtml;
                }
            });
        }

        //登出按鈕點擊
        $scope.logoutClick = function () {

            //優先檢查儲存的帳號狀態
            appService.checkStorageStatus().then(function (user) {
                $scope.isLogout = true;
                var confirmText = '';

                if ($rootScope.isDataModifyNotSave) {
                    confirmText += '您有修改資料【未儲存】！\r\n';
                }

                $timeout(function () {
                    confirmText += '請確認是否登出系統？';
                    if ($window.confirm(confirmText)) {
                        $rootScope.logining = '';
                    } else {
                        $scope.isLogout = false;
                    }
                }, 100);
            });
        }
    }]);

//輪播圖片設定 controller
app.controller('sliderSettingCtrl', ['$scope', 'appService', 'APP_CONSTANT', 'ajax', '$window', '$rootScope',
    function ($scope, appService, APP_CONSTANT, ajax, $window, $rootScope) {

        var inProc = false;
        var originSliderList;       //原始輪播資料清單(比對修改差異用)

        //取得輪播資訊清單
        var getSliderList = function () {

            //優先檢查儲存的帳號狀態
            appService.checkStorageStatus().then(function (user) {

                //伺服器處理
                $scope.isProcessing = ajax.get(APP_CONSTANT.SLIDER_LIST_ACTION)
                    .then(function (response) {
                        if (response.status === 200) {
                            if (response.data.result === -99) {      //存取資料庫發生錯誤
                                alert('【查詢錯誤！】\r\nresult: ' + response.data.result + '\r\nmessage: ' + response.data.message);
                            } else {
                                originSliderList = response.data.data;
                                $scope.isOnCount = 0;

                                //原始輪播資料加入異動註記
                                if (originSliderList) {
                                    for (var i in originSliderList.sliders) {
                                        originSliderList.sliders[i].modify = false;

                                        //計算已啟用的輪播圖片數量
                                        if (angular.equals(originSliderList.sliders[i].is_on, 1)) {
                                            $scope.isOnCount++;
                                        }
                                    }

                                    //複製一份原始輪播資料畫面繫結用
                                    $scope.sliderList = angular.copy(originSliderList);
                                }

                                //初始化異動資料變數(全域資料異動註記、目前編輯的輪播編號、編輯註記)
                                $rootScope.isDataModifyNotSave = false;
                                $scope.currentEditId = 0;
                                $scope.isEditing = false;
                            }
                        } else {        //網路傳輸失敗
                            alert('【查詢錯誤！】\r\nresult: ' + response.status + '\r\nmessage: ' + response.statusText);
                        }
                    });
            });
        }

        //上傳輪播圖片處理
        var uploadSliderImage = function (file) {

            //優先檢查儲存的帳號狀態
            appService.checkStorageStatus().then(function (user) {
                if (file) {
                    inProc = true;

                    //產生表單物件
                    var formData = new FormData();
                    formData.append('file', file);
                    formData.append('update_user', user);

                    //伺服器處理
                    $scope.isProcessing = ajax.postWithFormData(APP_CONSTANT.SLIDER_UPLOAD_ACTION, formData)
                        .then(function (response) {
                            if (response.status === 200) {
                                if (response.data.result === 1) {
                                    getSliderList();
                                    alert('輪播圖片【上傳成功！】');
                                } else if (response.data.result === -98) {        //伺服器資料處理失敗
                                    alert('【上傳失敗！】\r\nresult: ' + response.data.result + '\r\nmessage: 上傳圖片資料參數遺失');
                                } else {
                                    alert('【上傳失敗！】\r\nresult: ' + response.data.result + '\r\nmessage: ' + response.data.message);
                                }
                            } else {        //網路傳輸失敗
                                alert('【上傳失敗！】\r\nresult: ' + response.status + '\r\nmessage: ' + response.statusText);
                            }

                            inProc = false;
                        });
                }
            });
        }

        //存放繫結至畫面用的輪播資訊陣列
        $scope.sliderList = [];

        //目前正在編輯的輪播資料編號
        $scope.currentEditId = 0;

        //編輯狀態
        $scope.isEditing = false;

        //目前正在編輯的輪播原始資料模型
        $scope.currentOriginSliderModel = null;

        //Boostrap DateTimePicker 參數
        $scope.dateTimePickerParams = {
            autoclose: true,
            todayBtn: true,
            todayHighlight: true,
            language: 'zh-TW',
            format: 'yyyy-mm-dd',
            minView: 'month',
            startDate: new Date()
        }

        //開啟輪播編輯
        $scope.openEdit = function ($index) {

            //優先檢查儲存的帳號狀態
            appService.checkStorageStatus().then(function (user) {
                $scope.currentEditId = $scope.sliderList.sliders[$index].id;      //目前的輪播編號
                $scope.isEditing = true;
            });
        }

        //取消輪播編輯
        $scope.cancelEdit = function ($index) {

            //優先檢查儲存的帳號狀態
            appService.checkStorageStatus().then(function (user) {

                //資料異動提示確認
                if ($scope.sliderList.sliders[$index].modify) {
                    if (!$window.confirm('修改資料【未儲存】，確認要取消返回？')) {
                        return;
                    }

                    //還原資料
                    originSliderList.sliders[$index].modify = false;
                    $scope.sliderList.sliders[$index] = angular.copy(originSliderList.sliders[$index]);

                    //全域資料異動註記，供離開頁面時提示判斷
                    $rootScope.isDataModifyNotSave = false;
                }

                //關閉編輯狀態
                $scope.currentEditId = 0;
                $scope.isEditing = false;
            });
        }

        //檢查輪播資料欄位是否有異動過
        $scope.checkDataHasChange = function ($index) {

            //優先檢查儲存的帳號狀態
            appService.checkStorageStatus().then(function (user) {
                var originSliderModel = originSliderList.sliders[$index];        //原始資料
                var sliderModel = $scope.sliderList.sliders[$index];     //異動資料

                //判斷異動資料是否與原始資料相同
                var checkEquals = angular.equals(originSliderModel, sliderModel);

                //異動註記
                sliderModel.modify = !checkEquals;
                originSliderModel.modify = !checkEquals;

                //全域資料異動註記，供離開頁面時提示判斷
                $rootScope.isDataModifyNotSave = !checkEquals;
            });
        }

        //檢查上傳的輪播圖片格式
        $scope.checkSliderImage = function (file, errFiles) {

            //優先檢查儲存的帳號狀態
            appService.checkStorageStatus().then(function (user) {
                if (!inProc) {

                    //檢查上傳檔案是否正確
                    var errFile = errFiles && errFiles[0];
                    if (errFile) {

                        //檢查選擇的圖片資料是否正確
                        if (angular.equals(errFile.$error, 'pattern')) {        //圖片格式錯誤
                            alert('【上傳失敗！】\r\nmessage: 請選擇正確的圖片格式檔案\r\n您選擇的檔案為: ' + errFile.name);
                            return;
                        } else if (angular.equals(errFile.$error, 'minWidth') || angular.equals(errFile.$error, 'maxWidth') ||      //圖片與建議尺寸不符
                            angular.equals(errFile.$error, 'minHeight') || angular.equals(errFile.$error, 'maxHeight')) {

                            if (!$window.confirm('【上傳確認！】\r\n您選擇的圖片尺寸與建議尺寸不同\r\n建議圖片尺寸：【' + $scope.sliderList.recommand_image_width + ' * ' + $scope.sliderList.recommand_image_height + '】\r\n您選擇的圖片尺寸：【' + errFile.$ngfWidth + ' * ' + errFile.$ngfHeight + '】\r\n請確認是否繼續？')) {
                                return;
                            }

                        } else {        //其他錯誤
                            alert('【上傳失敗！】\r\nresult: ' + errFile.$error + '\r\nmessage: ' + errFile.$errorParam);
                            return;
                        }
                    }

                    uploadSliderImage(file || errFile);
                }
            });
        }

        //刪除輪播資訊
        $scope.deleteSlider = function ($index) {

            //優先檢查儲存的帳號狀態
            appService.checkStorageStatus().then(function (user) {
                var sliderModel = $scope.sliderList.sliders[$index];

                if (!inProc && sliderModel && $window.confirm('確認要【刪除】此則輪播圖片？')) {

                    inProc = true;

                    //伺服器處理
                    $scope.isProcessing = ajax.post(APP_CONSTANT.SLIDER_DELETE_ACTION,
                        {
                            model: sliderModel,
                            update_user: user
                        })
                        .then(function (response) {
                            if (response.status === 200) {
                                if (response.data.result === 1) {
                                    getSliderList();
                                } else if (response.data.result === 0) {
                                    alert('【刪除失敗！】\r\nresult: ' + response.data.result + '\r\nmessage: 無對應輪播資料');
                                } else if (response.data.result === -98) {        //伺服器資料處理失敗
                                    alert('【刪除失敗！】\r\nresult: ' + response.data.result + '\r\nmessage: 刪除輪播資料參數遺失');
                                } else {
                                    alert('【刪除失敗！】\r\nresult: ' + response.data.result + '\r\nmessage: ' + response.data.message);
                                }
                            } else {        //網路傳輸失敗
                                alert('【刪除失敗！】\r\nresult: ' + response.status + '\r\nmessage: ' + response.statusText);
                            }

                            inProc = false;
                        });
                }
            });
        }

        //更新輪播資訊
        $scope.updateSlider = function ($index) {

            //優先檢查儲存的帳號狀態
            appService.checkStorageStatus().then(function (user) {
                var sliderModel = $scope.sliderList.sliders[$index];

                if (!inProc && sliderModel) {

                    //檢查上下架日期格式
                    if (sliderModel.begin_date.length > 0 && isNaN(Date.parse(sliderModel.begin_date))) {
                        alert('【修改失敗！】\r\n輪播圖片【上架日期】格式不正確');
                        return;
                    }

                    if (sliderModel.end_date.length > 0 && isNaN(Date.parse(sliderModel.end_date))) {
                        alert('【修改失敗！】\r\n輪播圖片【下架日期】格式不正確');
                        return;
                    }

                    //檢查上下架日期區間
                    if (sliderModel.begin_date.length > 0 && sliderModel.end_date.length > 0 && sliderModel.begin_date > sliderModel.end_date) {
                        alert('【修改失敗！】\r\n輪播圖片【上架日期】不可在【下架日期】之後');
                        return;
                    }

                    inProc = true;

                    //伺服器處理
                    $scope.isProcessing = ajax.post(APP_CONSTANT.SLIDER_UPDATE_ACTION,
                        {
                            model: sliderModel,
                            update_user: user
                        })
                        .then(function (response) {
                            if (response.status === 200) {
                                if (response.data.result === 1) {
                                    getSliderList();
                                    alert('輪播資料【修改成功！】');
                                } else if (response.data.result === 0) {
                                    alert('【修改失敗！】\r\nresult: ' + response.data.result + '\r\nmessage: 無對應輪播資料');
                                } else if (response.data.result === -98) {
                                    alert('【修改失敗！】\r\nresult: ' + response.data.result + '\r\nmessage: 修改輪播資料參數遺失');
                                } else {
                                    alert('【修改失敗！】\r\nresult: ' + response.data.result + '\r\nmessage: ' + response.data.message);
                                }
                            } else {        //網路傳輸失敗
                                alert('【修改失敗！】\r\nresult: ' + response.status + '\r\nmessage: ' + response.statusText);
                            }

                            inProc = false;
                        });
                }
            });
        }

        getSliderList();
    }]);

//園所資訊維護 controller
app.controller('companySettingCtrl', ['$scope', 'appService', 'gMapService', 'APP_CONSTANT', 'ajax', '$window', '$timeout', '$rootScope',
    function ($scope, appService, gMapService, APP_CONSTANT, ajax, $window, $timeout, $rootScope) {

        var inProc = false;
        var originCompanyList;

        //目前要編輯的園所編號
        $scope.currentEditId = 0;

        //目前要刪除的園所編號
        $scope.currentDeleteId = 0;

        //編輯狀態
        $scope.isEditing = false;

        //新增園所物件
        $scope.addCompanyObj = {
            name: null,
            city: null,
            city_id: null,
            add: null,
            tel: null,
            youtube_playlist: null,
            lat: null,
            lng: null,
            manager: null
        };

        //查詢園所物件
        $scope.queryCompanyListObj = {
            city_id: 0,
            is_on: -1
        };

        //取得所有園所資料清單
        $scope.getCompanyList = function () {

            //優先檢查儲存的帳號狀態
            appService.checkStorageStatus().then(function (user) {

                //伺服器處理
                $scope.isProcessing = ajax.get(APP_CONSTANT.COMPANY_LIST_ACTION, $scope.queryCompanyListObj)
                    .then(function (response) {
                        if (response.status === 200) {
                            if (response.data.result !== -99) {
                                originCompanyList = response.data.data;
                                $scope.companyList = [];
                                $scope.pagingAry = [];
                                $scope.curPagingNum = 1;

                                //初始化編輯資料變數(目前編輯的園所編號、要刪除的園所編號、編輯狀態、全域資料異動註記)
                                $scope.currentEditId = 0;
                                $scope.currentDeleteId = 0;
                                $scope.isEditing = false;
                                $rootScope.isDataModifyNotSave = false;

                                //產生分頁標籤數量
                                var companyListCount = ((originCompanyList) ? originCompanyList.length : 0);      //資料數量
                                for (var i = 1; i <= Math.ceil(companyListCount / APP_CONSTANT.COMPANY_LIST_ONCE_COUNT) ; i++) {
                                    $scope.pagingAry.push(i);
                                }

                                //取得首次查詢的指定顯示筆數資料列
                                if (originCompanyList) {
                                    for (var i = 0; i < originCompanyList.length; i++) {
                                        originCompanyList[i].modify = false;        //加入資料異動註記

                                        if (i < APP_CONSTANT.COMPANY_LIST_ONCE_COUNT) {
                                            $scope.companyList.push(angular.copy(originCompanyList[i]));
                                        }
                                    }
                                }
                            } else {        //存取資料庫發生錯誤
                                alert('【查詢錯誤！】\r\nresult: ' + response.data.result + '\r\nmessage: ' + response.data.message);
                            }
                        } else {        //網路傳輸失敗
                            alert('【查詢錯誤！】\r\nresult: ' + response.status + '\r\nmessage: ' + response.statusText);
                        }
                    });
            });
        }

        //開啟園所編輯
        $scope.openEdit = function ($index) {

            //優先檢查儲存的帳號狀態
            appService.checkStorageStatus().then(function (user) {
                $scope.currentEditId = $scope.companyList[$index].company_id;      //目前編輯的園所編號
                $scope.isEditing = true;
            });
        }

        //取消園所編輯
        $scope.cancelEdit = function ($index) {

            //優先檢查儲存的帳號狀態
            appService.checkStorageStatus().then(function (user) {

                //資料異動提示確認
                if ($scope.companyList[$index].modify) {
                    if (!$window.confirm('修改資料【未儲存】，確認要取消返回？')) {
                        return;
                    }

                    //還原資料
                    originCompanyList[$index].modify = false;
                    $scope.companyList[$index] = angular.copy(originCompanyList[$index]);

                    //全域資料異動註記，供離開頁面時提示判斷
                    $rootScope.isDataModifyNotSave = false;
                }

                //關閉編輯狀態
                $scope.isEditing = false;
                $scope.currentEditId = 0;
            });
        }

        //檢查園所資料欄位是否有異動過
        $scope.checkDataHasChange = function ($index) {

            //優先檢查儲存的帳號狀態
            appService.checkStorageStatus().then(function (user) {
                var originCompanyModel = originCompanyList[$index];        //原始資料
                var companyModel = $scope.companyList[$index];     //異動資料

                //判斷異動資料是否與原始資料相同
                var checkEquals = angular.equals(originCompanyModel, companyModel);

                //異動註記
                companyModel.modify = !checkEquals;
                originCompanyModel.modify = !checkEquals;

                //全域資料異動註記，供離開頁面時提示判斷
                $rootScope.isDataModifyNotSave = !checkEquals;
            });
        }

        //點擊分頁按鈕
        $scope.pagingClick = function (pagingNum) {

            //優先檢查儲存的帳號狀態
            appService.checkStorageStatus().then(function (user) {
                $scope.curPagingNum = pagingNum;
                $scope.companyList = [];
                var startIdx = ((pagingNum - 1) * APP_CONSTANT.COMPANY_LIST_ONCE_COUNT);
                for (var i = startIdx; i < originCompanyList.length; i++) {
                    if (i < startIdx + APP_CONSTANT.COMPANY_LIST_ONCE_COUNT) {
                        $scope.companyList.push(originCompanyList[i]);
                    }
                }
            });
        }

        //新增園所
        $scope.addCompany = function (formObj) {

            //優先檢查儲存的帳號狀態
            appService.checkStorageStatus().then(function (user) {
                if (formObj.$valid && !inProc) {      //表單驗證通過
                    inProc = true;

                    //路名(預防輸入重複城市名處理)
                    $scope.addCompanyObj.add = $scope.addCompanyObj.add.replace($scope.addCompanyObj.city.name, '');      //預防輸入重複城市名

                    //城市編號
                    $scope.addCompanyObj.city_id = $scope.addCompanyObj.city.id;

                    //組合城市名稱與路名進行轉換緯經度處理
                    var address = ($scope.addCompanyObj.city.name + $scope.addCompanyObj.add);
                    gMapService.addr2GeoInfo(address)
                        .then(function (response) {

                            if ($window.confirm('確認要【新增】此筆園所資訊？')) {
                                $scope.addCompanyObj.lat = response.geometry.location.lat();        //緯度
                                $scope.addCompanyObj.lng = response.geometry.location.lng();        //經度

                                //伺服器處理
                                $scope.isProcessing = ajax.post(APP_CONSTANT.ADD_COMPANY_ACTION,
                                    {
                                        model: $scope.addCompanyObj,
                                        update_user: user
                                    })
                                    .then(function (response) {
                                        if (response.status === 200) {
                                            if (response.data.result === 1) {

                                                alert('【新增成功！】\r\n您新增【' + $scope.addCompanyObj.name + '】的園所後台登入資訊如下：\r\n登入帳號：【' + response.data.data.login_acn + '】\
                                               \r\n登入密碼：【' + response.data.data.login_pwd + '】');

                                                //查詢參數設定為新增園所的縣市以供顯示
                                                $scope.queryCompanyListObj.city_id = $scope.addCompanyObj.city_id;

                                                //清空新增園所資料
                                                for (var prop in $scope.addCompanyObj) {
                                                    $scope.addCompanyObj[prop] = null;
                                                }

                                                $scope.getCompanyList();

                                            } else if (response.data.result === -98) {
                                                alert('【新增失敗！】\r\nresult: ' + response.data.result + '\r\nmessage: 新增園所資料參數遺失');
                                            } else {        //伺服器資料處理失敗
                                                alert('【新增失敗！】\r\nresult: ' + response.data.result + '\r\nmessage: ' + response.data.message);
                                            }
                                        } else {        //網路傳輸失敗
                                            alert('【新增失敗！】\r\nresult: ' + response.status + '\r\nmessage: ' + response.statusText);
                                        }

                                        inProc = false;
                                    });
                            } else {
                                inProc = false;
                            }
                        }, function (response) {
                            alert('【新增失敗！】\r\n您輸入的地址有誤，請重新確認');
                            inProc = false;
                            return;
                        });

                } else {        //表單驗證失敗
                    alert('【新增失敗！】\r\n* 號為必填欄位，請勿留下空白');
                    return;
                }
            });
        }

        //修改園所資料
        $scope.updateCompany = function ($index) {

            //優先檢查儲存的帳號狀態
            appService.checkStorageStatus().then(function (user) {
                if (!inProc) {
                    inProc = true;

                    var updateCompanyModel = $scope.companyList[$index];
                    $scope.currentEditId = updateCompanyModel.company_id;

                    $timeout(function () {      //需加入延遲點選刪除的列才會變色
                        if (updateCompanyModel.add.length === 0 || updateCompanyModel.pwd.length === 0) {
                            alert('【修改失敗！】\r\n* 號為必填欄位，請勿留下空白');
                            inProc = false;
                            return;
                        }

                        //組合城市名稱與路名進行轉換緯經度處理
                        var cityName = $rootScope.getCityNameById(updateCompanyModel.city_id);
                        var address = cityName + updateCompanyModel.add;
                        gMapService.addr2GeoInfo(address)
                                .then(function (response) {

                                    updateCompanyModel.lat = response.geometry.location.lat();        //緯度
                                    updateCompanyModel.lng = response.geometry.location.lng();        //經度

                                    //伺服器處理
                                    $scope.isProcessing = ajax.post(APP_CONSTANT.UPDATE_COMPANY_ACTION,
                                        {
                                            model: updateCompanyModel,
                                            update_user: user
                                        })
                                        .then(function (response) {
                                            if (response.status === 200) {
                                                if (response.data.result === 1) {
                                                    $scope.getCompanyList();
                                                    alert('園所資料【修改成功！】');
                                                } else if (response.data.result === 0) {
                                                    alert('【修改失敗！】\r\nresult: ' + response.data.result + '\r\nmessage: 無對應園所資料');
                                                } else if (response.data.result === -98) {
                                                    alert('【修改失敗！】\r\nresult: ' + response.data.result + '\r\nmessage: 修改園所資料參數遺失');
                                                } else {
                                                    alert('【修改失敗！】\r\nresult: ' + response.data.result + '\r\nmessage: ' + response.data.message);
                                                }
                                            } else {        //網路傳輸失敗
                                                alert('【修改失敗！】\r\nresult: ' + response.status + '\r\nmessage: ' + response.statusText);
                                            }

                                            inProc = false;
                                        });
                                }, function (response) {
                                    alert('【修改失敗！】\r\n您輸入的地址有誤，請重新確認');
                                    inProc = false;
                                    return;
                                });
                    });
                }
            });
        }

        //刪除園所資料
        $scope.deleteCompany = function ($index) {

            //優先檢查儲存的帳號狀態
            appService.checkStorageStatus().then(function (user) {
                if (!inProc) {
                    inProc = true;

                    var deleteCompanyModel = $scope.companyList[$index];
                    $scope.currentDeleteId = deleteCompanyModel.company_id;

                    $timeout(function () {     //需加入延遲點選刪除的列才會變色
                        if (deleteCompanyModel && $window.confirm('確認要刪除【' + deleteCompanyModel.name + '】園所資料？\r\n注意：此園所【職缺】將一併進行刪除')) {

                            $scope.isProcessing = ajax.post(APP_CONSTANT.DELETE_COMPANY_ACTION,
                                {
                                    model: deleteCompanyModel,
                                    update_user: user
                                })
                                .then(function (response) {
                                    if (response.status === 200) {
                                        if (response.data.result === 1) {
                                            //alert('園所刪除成功！');
                                            $scope.getCompanyList();
                                        } else if (response.data.result === 0) {
                                            alert('【刪除失敗！】\r\nresult: ' + response.data.result + '\r\nmessage: 無對應園所資料編號');
                                        } else if (response.data.result === -98) {
                                            alert('【刪除失敗！】\r\nresult: ' + response.data.result + '\r\nmessage: 刪除園所資料參數遺失');
                                        } else {
                                            alert('【刪除失敗！】\r\nresult: ' + response.data.result + '\r\nmessage: ' + response.data.message);
                                        }
                                    } else {        //網路傳輸失敗
                                        alert('【刪除失敗！】\r\nresult: ' + response.status + '\r\nmessage: ' + response.statusText);
                                    }

                                    inProc = false;
                                });
                        } else {
                            $scope.currentDeleteId = 0;
                            inProc = false;
                        }
                    });
                }
            });
        }

        $scope.getCompanyList();
    }]);

//園所職缺維護 controller
app.controller('jobSettingCtrl', ['$scope', 'appService', 'gMapService', 'APP_CONSTANT', 'ajax', '$window', '$timeout',
     function ($scope, appService, gMapService, APP_CONSTANT, ajax, $window, $timeout) {

         var inProc = false;
         var companyJobsTotalData;       //全部資料
         $scope.curModifyCompanyJobId = 0;     //目前要異動的園所職缺編號

         //新增園所職缺物件
         $scope.addCompanyJobObj = {
             city_id: 0,
             company_id: null,
             job_kind_id: null
         };

         //查詢園所職缺物件
         $scope.queryCompanyJobObj = {
             city_id: 0,
             company_id: 0
         };

         //取得所有園所職缺清單
         $scope.getAllCompanyJobList = function () {

             //優先檢查儲存的帳號狀態
             appService.checkStorageStatus().then(function (user) {
                 $scope.isProcessing = ajax.get(APP_CONSTANT.ALL_COMPANY_JOB_LIST_ACTION, $scope.queryCompanyJobObj)
                                  .then(function (response) {
                                      if (response.status === 200) {
                                          if (response.data.result !== -99) {
                                              companyJobsTotalData = response.data.data;
                                              $scope.companyJobsList = [];
                                              $scope.pagingAry = [];
                                              $scope.curPagingNum = 1;

                                              //產生分頁標籤數量
                                              var companyJobsListCount = ((companyJobsTotalData) ? companyJobsTotalData.length : 0);      //資料數量
                                              for (var i = 1; i <= Math.ceil(companyJobsListCount / APP_CONSTANT.COMPANY_JOBS_LIST_ONCE_COUNT) ; i++) {
                                                  $scope.pagingAry.push(i);
                                              }

                                              //取得首次查詢的指定顯示筆數資料列
                                              if (companyJobsTotalData) {
                                                  for (var i = 0; i < companyJobsTotalData.length; i++) {
                                                      if (i < APP_CONSTANT.COMPANY_JOBS_LIST_ONCE_COUNT) {
                                                          $scope.companyJobsList.push(companyJobsTotalData[i]);
                                                      }
                                                  }
                                              }

                                          } else {        //存取資料庫發生錯誤
                                              alert('【查詢錯誤！】\r\nresult: ' + response.data.result + '\r\nmessage: ' + response.data.message);
                                          }
                                      } else {        //網路傳輸失敗
                                          alert('【查詢錯誤！】\r\nresult: ' + response.status + '\r\nmessage: ' + response.statusText);
                                      }
                                  });
             });
         }

         //點擊分頁按鈕
         $scope.pagingClick = function (pagingNum) {

             //優先檢查儲存的帳號狀態
             appService.checkStorageStatus().then(function (user) {
                 $scope.curPagingNum = pagingNum;
                 $scope.companyJobsList = [];
                 var startIdx = ((pagingNum - 1) * APP_CONSTANT.COMPANY_JOBS_LIST_ONCE_COUNT);
                 for (var i = startIdx; i < companyJobsTotalData.length; i++) {
                     if (i < startIdx + APP_CONSTANT.COMPANY_JOBS_LIST_ONCE_COUNT) {
                         $scope.companyJobsList.push(companyJobsTotalData[i]);
                     }
                 }
             });
         }

         //依據選擇的城市取得相對應的園所列表
         $scope.getCompanysByCity = function (type) {

             //優先檢查儲存的帳號狀態
             appService.checkStorageStatus().then(function (user) {

                 //判斷要求來源 - 1：新增職缺要求園所列表、2：查詢職缺要求園所列表
                 var cityId;
                 if (type === 1) {
                     $scope.addCompanyJobObj.company_id = null;
                     cityId = $scope.addCompanyJobObj.city_id;
                 } else {
                     $scope.queryCompanyJobObj.company_id = 0;
                     cityId = $scope.queryCompanyJobObj.city_id;
                 }

                 ajax.get(APP_CONSTANT.GET_COMPANYS_BY_CITY_ACTION, {       //判斷要求園所列表來源是新增或者查詢
                     city_id: cityId
                 }).then(function (response) {
                     if (response.status === 200) {
                         if (response.data.result !== -99) {
                             if (type === 1) {
                                 $scope.companyList = response.data.data;
                             } else {
                                 $scope.queryCompanyList = [{ company_id: 0, name: '全部' }];
                                 for (var idx in response.data.data) {
                                     $scope.queryCompanyList.push(response.data.data[idx]);
                                 }
                             }
                         } else {        //存取資料庫發生錯誤
                             alert('【查詢錯誤！】\r\nresult: ' + response.data.result + '\r\nmessage: ' + response.data.message);
                         }
                     } else {        //網路傳輸失敗
                         alert('【查詢錯誤！】\r\nresult: ' + response.status + '\r\nmessage: ' + response.statusText);
                     }
                 });
             });
         }

         //依據選擇的園所取得尚未建立的職缺種類列表
         $scope.getJobKindsByCompany = function () {

             //優先檢查儲存的帳號狀態
             appService.checkStorageStatus().then(function (user) {
                 ajax.get(APP_CONSTANT.GET_JOB_KINDS_BY_COMPANY_ACTION, {
                     company_id: $scope.addCompanyJobObj.company_id
                 }).then(function (response) {
                     if (response.status === 200) {
                         if (response.data.result !== -99) {
                             $scope.allJobKindsByCompany = response.data.data;
                         } else {        //存取資料庫發生錯誤
                             alert('【查詢錯誤！】\r\nresult: ' + response.data.result + '\r\nmessage: ' + response.data.message);
                         }
                     } else {        //網路傳輸失敗
                         alert('【查詢錯誤！】\r\nresult: ' + response.status + '\r\nmessage: ' + response.statusText);
                     }
                 });
             });
         }

         //新增園所職缺
         $scope.addCompanyJob = function () {

             //優先檢查儲存的帳號狀態
             appService.checkStorageStatus().then(function (user) {
                 if ($window.confirm('確認要【新增】此筆園所職缺資訊？') && !inProc) {
                     inProc = true;

                     //伺服器處理
                     $scope.isProcessing = ajax.post(APP_CONSTANT.ADD_COMPANY_JOB_ACTION,
                         {
                             model: $scope.addCompanyJobObj,
                             update_user: user
                         })
                         .then(function (response) {
                             if (response.status === 200) {
                                 if (response.data.result === 1) {
                                     //alert('園所職缺新增成功！');
                                     $scope.addCompanyJobObj.job_kind_id = null;
                                     $scope.queryCompanyJobObj.company_id = $scope.addCompanyJobObj.company_id;     //查詢參數設定為新增職缺的園所以供顯示
                                     $scope.getAllCompanyJobList();
                                     $scope.getJobKindsByCompany();
                                 } else if (response.data.result === -98) {
                                     alert('【新增失敗！】\r\nresult: ' + response.data.result + '\r\nmessage: 新增園所職缺資料參數遺失');
                                 } else {
                                     alert('【新增失敗！】\r\nresult: ' + response.data.result + '\r\nmessage: ' + response.data.message);
                                 }
                             } else {        //網路傳輸失敗
                                 alert('【新增失敗！】\r\nresult: ' + response.status + '\r\nmessage: ' + response.statusText);
                             }

                             inProc = false;
                         });
                 }
             });
         }

         //刪除園所職缺
         $scope.deleteCompanyJob = function ($index) {

             //優先檢查儲存的帳號狀態
             appService.checkStorageStatus().then(function (user) {
                 if (!inProc) {
                     inProc = true;

                     var companyJobObj = $scope.companyJobsList[$index];
                     $scope.curModifyCompanyJobId = companyJobObj.job_id;

                     $timeout(function () {     //需加入延遲點選刪除的列才會變色
                         if (companyJobObj && $window.confirm('確認要【刪除】此筆園所職缺？\r\n【' + companyJobObj.company_name + '】-【' + companyJobObj.job_kind_name + '】')) {

                             $scope.isProcessing = ajax.post(APP_CONSTANT.DELETE_COMPANY_JOB_ACTION,
                                 {
                                     job_id: companyJobObj.job_id,
                                     update_user: user
                                 })
                                 .then(function (response) {
                                     if (response.status === 200) {
                                         if (response.data.result === 1) {
                                             //alert('園所職缺刪除成功！');
                                             $scope.addCompanyJobObj.city_id = 0;
                                             $scope.addCompanyJobObj.company_id = null;
                                             $scope.addCompanyJobObj.job_kind_id = null;
                                             $scope.getAllCompanyJobList();
                                         } else if (response.data.result === 0) {
                                             alert('【刪除失敗！】\r\nresult: ' + response.data.result + '\r\nmessage: 無對應園所職缺資料編號');
                                         } else {
                                             alert('【刪除失敗！】\r\nresult: ' + response.data.result + '\r\nmessage: ' + response.data.message);
                                         }
                                     } else {        //網路傳輸失敗
                                         alert('【刪除失敗！】\r\nresult: ' + response.status + '\r\nmessage: ' + response.statusText);
                                     }

                                     inProc = false;
                                 });
                         } else {
                             $scope.curModifyCompanyJobId = 0;
                             inProc = false;
                         }
                     });
                 }
             });
         }

         $scope.getCompanysByCity(1);
         $scope.getCompanysByCity(2);
         $scope.getAllCompanyJobList();

     }]);