app.factory('appService', ['$q', '$timeout', 'Upload', 'ajax', 'APP_CONSTANT', '$sessionStorage', '$window', '$location', '$rootScope',
    function ($q, $timeout, Upload, ajax, APP_CONSTANT, $sessionStorage, $window, $location, $rootScope) {

        /**
         * @description 上傳檔案至伺服器
         * @param file 要上傳的檔案
         * @param url 要上傳的伺服器位址
         */
        var uploadFile = function (file, url) {
            var defer = $q.defer();

            if (file && url) {
                Upload.upload({
                    url: url,
                    data: { file: file }
                }).then(function (response) {       //network success
                    $timeout(function () {
                        defer.resolve(response.data);
                    });
                }, function (response) {        //network failure
                    defer.reject('上傳失敗！\r\nresult: ' + response.status + '\r\nmessage: ' + response.data);
                });
            } else {
                if (!file) {
                    defer.reject('上傳失敗！\r\nmessage: 上傳檔案參數遺失: client');
                } else if (url) {
                    defer.reject('上傳失敗！\r\nmessage: 上傳伺服器位址參數遺失！');
                }
            }

            return defer.promise;
        }

        /**
         * @description 取得所有城市資料
         */
        var getAllCitys = function () {
            var defer = $q.defer();

            ajax.get(APP_CONSTANT.ALL_CITYS_ACTION)
                .then(function (response) {
                    if (response.status === 200) {
                        if (response.data.result === 1) {
                            defer.resolve(response.data.data);
                        } else if (response.data.result === 0) {
                            defer.reject('初始化城市資料失敗！\r\nresult: ' + response.data.result + '\r\nmessage: 無城市資料');
                        } else {
                            defer.reject('初始化城市資料失敗！\r\nresult: ' + response.data.result + '\r\nmessage: ' + response.data.message);
                        }
                    } else {
                        defer.reject('初始化城市資料失敗！\r\nresult: ' + response.status + '\r\nmessage: ' + response.statusText);
                    }
                });

            return defer.promise;
        }

        /**
         * @description 取得所有職缺種類資料
         */
        var getAllJobsKind = function () {
            var defer = $q.defer();

            ajax.get(APP_CONSTANT.ALL_JOBS_KIND_ACTION)
                .then(function (response) {
                    if (response.status === 200) {
                        if (response.data.result === 1) {
                            defer.resolve(response.data.data);
                        } else if (response.data.result === 0) {
                            defer.reject('初始化職缺種類資料失敗！\r\nresult: ' + response.data.result + '\r\nmessage: 無職缺種類資料');
                        } else {
                            defer.reject('初始化職缺種類資料失敗！\r\nresult: ' + response.data.result + '\r\nmessage: ' + response.data.message);
                        }
                    } else {
                        defer.reject('初始化職缺種類資料失敗！\r\nresult: ' + response.status + '\r\nmessage: ' + response.statusText);
                    }
                });

            return defer.promise;
        }

        /**
         * @description 檢查儲存的登入帳號是否存在，若不存在則導回登入頁
         */
        var checkStorageStatus = function () {
            var defer = $q.defer();

            if (angular.isDefined($sessionStorage.logining) && $sessionStorage.logining.length > 0) {
                defer.resolve($sessionStorage.logining);
            } else {
                $rootScope.logining = '';
            }

            return defer.promise;
        }

        return {
            uploadFile: uploadFile,
            getAllCitys: getAllCitys,
            getAllJobsKind: getAllJobsKind,
            checkStorageStatus: checkStorageStatus
        }
    }]);