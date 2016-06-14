/**
 * @description AngularJS 公用服務模組版本建立
 * @author Eason
 * @since 20160303
 * @version 1
 * 
 * @description 新增使用 Google Maps API 計算出發地與目的地之間的距離與時間
 * @author Eason
 * @since 20160325
 * @version 2
 */

//工具服務模組
var toolsServiceModule = angular.module('toolsServiceModule', []);

//HTTP AJAX Service
toolsServiceModule.factory('ajax', ['$http', function ($http) {
    var obj = {};

    obj.get = function (url, params) {
        params = params || {};
        return $http.get(url, { params: params, cache: false }).then(function (response) {
            //成功 response 內容範例：{data: "1", status: 200, config: Object, statusText: "OK"}
            return response;
        }, function (error) {
            //404 error 物件內容範例：{data: Object, status: 404, config: Object, statusText: "Not Found"}
            return error;
        });
    }

    obj.post = function (url, params) {
        return $http.post(url, params, { cache: false }).then(function (response) {
            //成功 response 內容範例：{data: "1", status: 200, config: Object, statusText: "OK"}
            return response;
        }, function (error) {
            //404 error 物件內容範例：{data: Object, status: 404, config: Object, statusText: "Not Found"}
            return error;
        });
    }

    obj.postWithFormData = function (url, formData) {
        return $http.post(url, formData, {
            cache: false,
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then(function (response) {
            //成功 response 內容範例：{data: "1", status: 200, config: Object, statusText: "OK"}
            return response;
        }, function (error) {
            //404 error 物件內容範例：{data: Object, status: 404, config: Object, statusText: "Not Found"}
            return error;
        });
    }

    obj.jsonp = function (url, params) {
        params = params || {};
        return $http.jsonp(url, { params: params, cache: false }).then(function (response) {
            //成功 response 內容範例：{data: "1", status: 200, config: Object, statusText: "OK"}
            return response;
        }, function (error) {
            //404 error 物件內容範例：{data: Object, status: 404, config: Object, statusText: "Not Found"}
            return error;
        });
    }

    return obj;
}]);

//一般工具
toolsServiceModule.factory('tool', ['$location', '$window', '$rootScope', function ($location, $window, $rootScope) {
    var obj = {};

    //指定 ngRoute 設定的路由路徑
    obj.toRouteUrl = function (path) {
        $location.path(path);
    }

    //Xml 物件轉字串
    obj.xmlToString = function (xmlObject) {
        var xmlString;
        if (window.ActiveXObject) { // for IE
            xmlString = xmlObject.xml;
            if (!xmlString) {       //for IE9
                xmlString = (new XMLSerializer()).serializeToString(xmlObject);
            }
        } else {
            xmlString = (new XMLSerializer()).serializeToString(xmlObject);
        }
        return xmlString;
    }

    //關閉當前視窗
    obj.closeSelfWindow = function () {
        top.window.open('', '_self');
        top.window.close();
    }

    //瀏覽器 Url 處理
    obj.urlHandle = {

        //取得 Url 資訊
        getInfo: {
            absUrl: function () { return $location.absUrl(); },
            protocol: function () { return $location.protocol(); },
            host: function () { return $location.host(); },
            port: function () { return $location.port(); },
            path: function () { return $location.path(); },
            pathAndParams: function () { return $location.url(); },
            params: function () { return $location.search(); },
            domain: function () { return $location.protocol() + '://' + $location.host() + ':' + $location.port(); }
        },

        //設定 Url 路徑與傳送參數(不會觸發Server端)
        setPathWithParams: function (path, params) {
            if (path && params) {
                $location.url(path) + $location.search(params);
            } else if (path) {
                $location.url(path);
            } else if (params) {
                $location.search(params);
            }
        },

        /** 導回第一層根目錄(會觸發Server端)
         * useReplace： true-不會留下歷史紀錄、false-使用一般轉址
         */
        redirectToRoot: function (useReplace) {
            useReplace = ((useReplace) ? useReplace : false);
            if (useReplace) {
                top.window.location.replace(this.getInfo.domain());
            } else {
                top.window.location.href = this.getInfo.domain();
            }
        }
    }

    obj.isMobileDevice = function () {
        return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4));
    }

    obj.checkIEVersion = function (ver) {
        return navigator.appVersion.indexOf('MSIE ' + ver + '.') > -1;
    }

    //將所要查看的資訊顯示在主控台
    obj.watch = function () {
        if (arguments.length > 1) {
            console.debug.apply(console, arguments);
        } else {
            console.debug(arguments[0]);
        }
    }

    //Line分享資訊至手機
    obj.lineShare = function (shareText, useOpen) {
        var url = 'http://line.me/R/msg/text/?' + lineShare;
        if (useOpen) {
            top.window.open(url);
        } else {
            top.window.location.href = url;
        }
    }

    //監聽輸入按鍵是否為數字鍵
    obj.isNumberKeyCode = function (e) {
        return ((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) ||
        (e.keyCode == 8) || (e.keyCode >= 37 && e.keyCode <= 40));
    }

    /**
     * @description - 檢測視窗寬度
     * @returns - 視窗寬度
     */
    obj.detectWindowWidth = function () {
        return $window.innerWidth;
    }

    return obj;
}]);

//時區處理服務
toolsServiceModule.factory('timeZone', ['ajax', '$q', function (ajax, $q) {

    //此key目前使用自己的帳號
    var timeZoneDBApi = { key: 'F6G3G8A2Q4LJ', url: 'http://api.timezonedb.com' }

    /**
     * @description 取得世界各地時區 (使用 https://timezonedb.com/ API)
     * @param zone - 縣市所屬時區代碼
     * @param format - 資料回傳格式 (xml or json)
     * @returns 時區資訊物件
     */
    var getTimeZoneInfo = function (zone, format) {
        var defer = $q.defer();

        ajax.jsonp(timeZoneDBApi.url + '?callback=JSON_CALLBACK', {
            zone: zone,
            format: format,
            key: timeZoneDBApi.key
        }).then(function (response) {
            if (angular.equals(response.status, 200) && angular.equals(angular.lowercase(response.data.status), 'ok')) {
                defer.resolve(response.data);
            } else {
                watch(response);
                defer.reject(null);
            }
        });

        return defer.promise;
    }

    return {
        getTimeZoneInfo: getTimeZoneInfo
    }
}]);

//地理位置服務模組
var geoLocationServiceModule = angular.module('geoLocationServiceModule', []);

//地理位置資訊服務
geoLocationServiceModule.factory('geoService', ['$q', function ($q) {

    /**
     * @description 取得使用者地理位址緯經度資訊
     * @returns 成功 - 回傳緯經度Json資料
     *          失敗 - 失敗訊息：瀏覽器要求緯經度發生錯誤、-1：瀏覽器不支援地理位置API
     */
    var getGeoLatLng = function () {
        var defer = $q.defer();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                defer.resolve({
                    lat: position.coords.latitude,      //緯度
                    lng: position.coords.longitude      //經度
                });
            }, function (error) {
                defer.reject(error);        //瀏覽器要求緯經度發生錯誤(使用者取消)
            });
        } else {
            defer.reject(-1);       //瀏覽器不支援地理位置API
        }

        return defer.promise;
    }

    return {
        getGeoLatLng: getGeoLatLng
    }
}]);

//Google Maps 服務
geoLocationServiceModule.factory('gMapService', ['$q', function ($q) {

    /**
     * @description 利用緯經度取得使用者地理位址詳細資訊
     * @requires Google Map API
     * @param lat：緯度
     *        lng：經度
     * @returns 成功 - 回傳地理位置Json資料
     *          失敗 - 狀態碼如下
     *                ZERO_RESULTS - 指出地理編碼成功，但是未傳回任何結果。如果傳遞了不存在的 address 給地理編碼器，就可能發生這種情況。
     *                OVER_QUERY_LIMIT - 指出已超出您的配額。
     *                REQUEST_DENIED - 指出您的要求已被拒絕。
     *                INVALID_REQUEST - 通常指出缺少查詢 (address、components 或 latlng)。
     *                UNKNOWN_ERROR - 指出由於發生伺服器錯誤，而無法處理要求。重新嘗試該要求或許會成功。
     */
    var latlng2GeoInfo = function (lat, lng) {
        var defer = $q.defer();
        var geoCoder = new google.maps.Geocoder();
        var latlng = new google.maps.LatLng(lat, lng);
        var geoCodeCallBack = function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                defer.resolve(results);
            } else {
                defer.reject(status);
            }
        }

        geoCoder.geocode({ latLng: latlng }, geoCodeCallBack);
        return defer.promise;
    }

    /**
     * @description 利用地址取得使用者地理位址詳細資訊
     * @requires Google Map API
     * @param addr：地址
     * @returns 成功 - 回傳地理位置Json資料
     *          失敗 - 狀態碼如下
     *                ZERO_RESULTS - 指出地理編碼成功，但是未傳回任何結果。如果傳遞了不存在的 address 給地理編碼器，就可能發生這種情況。
     *                OVER_QUERY_LIMIT - 指出已超出您的配額。
     *                REQUEST_DENIED - 指出您的要求已被拒絕。
     *                INVALID_REQUEST - 通常指出缺少查詢 (address、components 或 latlng)。
     *                UNKNOWN_ERROR - 指出由於發生伺服器錯誤，而無法處理要求。重新嘗試該要求或許會成功。
     */
    var addr2GeoInfo = function (addr) {
        var defer = $q.defer();
        var geoCoder = new google.maps.Geocoder();

        geoCoder.geocode({ address: addr }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                defer.resolve(results[0]);
            } else {
                defer.reject(status);
            }
        });

        return defer.promise;
    }

    /**
     * @description 計算出發地與目的地之間的距離與時間
     * @requires Google Map API
     * @param originObjAry - 出發地物件陣列(可傳入多個經緯度或地址，最大數量不可超過25個)
     *        destinationObjAry - 目的地物件陣列(可傳入多個經緯度或地址，最大數量不可超過25個)
     *        travelMode - 旅行模式如下
     *                     google.maps.TravelMode.BICYCLING - 要求使用單車車道與偏好街道的單車路線規劃 (目前只能在美國和某些加拿大縣市使用)。
     *                     google.maps.TravelMode.DRIVING - (預設) 指出行駛公路網的標準開車路線規劃。
     *                     google.maps.TravelMode.TRANSIT - 要求使用大眾運輸路線的路線規劃。此選項只有在要求包含 API 金鑰時才可以指定。請參閱大眾運輸選項以瞭解此要求類型的可用選項。
     *                     google.maps.TravelMode.WALKING - 要求使用人行道的步行路線規劃。
     * @returns 成功 - 回傳兩點之間距離與時間資料
     *          失敗 - 狀態碼如下
     *                INVALID_REQUEST - 提供的要求無效。這通常是因為缺少必要的欄位。請參閱上面的支援的欄位清單。
     *                MAX_ELEMENTS_EXCEEDED - 起點數和目的地數的乘積超過每次查詢限制。
     *                MAX_DIMENSIONS_EXCEEDED - 您的要求內含超過 25 個起點，或超過 25 個目的地。
     *                OVER_QUERY_LIMIT - 您的應用程式在允許的期間內要求過多元素。在一段合理的時間之後重新嘗試該要求或許會成功。
     *                REQUEST_DENIED - 服務拒絕您的網頁使用 Distance Matrix 服務。
     *                UNKNOWN_ERROR - 由於發生伺服器錯誤，而無法處理 Distance Matrix 要求。重新嘗試該要求或許會成功。
     * @see https://developers.google.com/maps/documentation/javascript/distancematrix#distance_matrix_requests
     */
    var calcDistanceMatrix = function (originObjAry, destinationObjAry, travelMode) {
        var defer = $q.defer();
        var service = new google.maps.DistanceMatrixService();
        service.getDistanceMatrix({
            origins: originObjAry,
            destinations: destinationObjAry,
            travelMode: travelMode
        }, function (response, status) {
            if (status === google.maps.DistanceMatrixStatus.OK) {
                defer.resolve(response);
            } else {
                defer.reject(status);
            }
        });

        return defer.promise;
    }

    return {
        latlng2GeoInfo: latlng2GeoInfo,
        addr2GeoInfo: addr2GeoInfo,
        calcDistanceMatrix: calcDistanceMatrix
    }
}]);

//Google Analytics 模組
var gaServiceModule = angular.module('gaServiceModule', []);

//Google Analytics 服務
gaServiceModule.factory('ga', ['$rootScope', '$window', '$location', function ($rootScope, $window, $location) {

    /**
     * @description - 開啟Google Analytics追蹤功能
     * @param trackNo - 追蹤編號
     */
    var openTracking = function (trackNo) {

        //加入Google Analytics主程式，並依據追蹤編號開始追蹤
        (function (i, s, o, g, r, a, m) {
            i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
                (i[r].q = i[r].q || []).push(arguments)
            }, i[r].l = 1 * new Date(); a = s.createElement(o),
            m = s.getElementsByTagName('head')[0]; a.async = 1; a.src = g; m.appendChild(a);
            a.onload = function () {
                $window.ga('create', trackNo, 'auto');
                $window.ga('require', 'linkid', 'linkid.js');       //追蹤自訂事件
                $window.ga('require', 'displayfeatures');       //追蹤客層與興趣報表
                $window.ga('send', 'pageview', {
                    page: $location.path()
                });
            }
        })(window, document, 'script', '//www.google-analytics.com/analytics.js', 'ga');

        //監聽路由改變事件並提供路由路徑給Google Analytics進行記錄
        $rootScope.$on('$routeChangeSuccess', function () {
            if ($window.ga) {
                $window.ga('send', 'pageview', {
                    page: $location.path()
                });
            }
        });
    }

    return {
        openTracking: openTracking
    }
}]);