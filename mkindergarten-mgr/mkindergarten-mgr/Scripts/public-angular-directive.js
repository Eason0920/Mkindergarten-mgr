/**
 * @description AngularJS 公用指令模組版本建立
 * @author Eason
 * @since 20160303
 * @version 1 
 * 
 * @description 增加 Flickity 輪播元件指令
 * @author Eason
 * @since 20160328
 * @version 2
 */

//UI 指令模組
var uiDirectiveModule = angular.module('uiDirectiveModule', []);

/** 
* @description 倒數計時器
* @requires 需先載入 countdown.js 主檔
* @example Html - <div id="myCountdown" countdown="{lastTime: 剩餘秒數, isShow: 是否顯示, src: JS檔路徑,
*                  width: 寬度, height: 高度, completeCallBack: 倒數結束回呼函式}"></div>
*          Json - $scope.countdownParams = {
                        isShow: function () {
                            return return (!tool.checkIEVersion(8)) && ($scope.initJson.vote_second > 0);
                        },
                        params: {
                            lastTime: $scope.initJson.vote_second,
                            width: 320,
                            height: 80,
                            textColor: '#FF0000',
                            startRange: 'hours',
                            completeCallBack: function () {        //倒數計時秒數完成
                                angular.element('#countdownWrap').slideUp();
                            }
                        }
                    }
*/
uiDirectiveModule.directive('countdown', [function () {
    var obj = {};
    obj.restrict = 'A';
    obj.scope = {
        countdown: '='
    };
    obj.link = function ($scope, $element, $attr) {
        if ($scope.countdown) {
            if ($scope.countdown.isShow()) {
                new Countdown({
                    time: $scope.countdown.params.lastTime,
                    width: $scope.countdown.params.width,
                    height: $scope.countdown.params.height,
                    rangeHi: $scope.countdown.params.startRange,
                    style: 'flip',
                    target: $attr.id,
                    onComplete: $scope.countdown.params.completeCallBack,
                    labels: {
                        color: $scope.countdown.params.textColor
                    }
                });
            }
        }
    };

    return obj;
}]);

/**
 * @description 使用 ng-template 範本開啟 fancybox 燈箱效果
 * @requires 需先載入 fancybox.js 主檔
 * 呼叫端 controller 需定義：
                         self.fancyboxParams = {
                                enable: true,      //初始化先不啟動fancybox
                                template: 'avUseDetails.html',     //勾選紀錄明細ng/template路徑
                                params: {
                                    helpers: {
                                        overlay: {
                                            closeClick: false
                                        }
                                    }
                                }
                            }
 */
uiDirectiveModule.directive('templateFancybox', ['$compile', '$templateCache', function ($compile, $templateCache) {
    var obj = {};

    obj.link = function (scope, element, attr) {
        element.on('click', function () {
            var html = $templateCache.get(scope.fancyboxParams.template);
            var compiled = $compile(html);
            var bindContent = compiled(scope);
            $.fancybox.open(bindContent, scope.fancyboxParams.params);
        });
    }

    return obj;
}]);

/**
 * @description 使用一般 js 方式開啟 fancybox 燈箱效果
 * @requires 需先載入 fancybox.js 主檔
 * @example html - <input type="button" fancybox="fancyboxParams" value="fancyBox測試" />
 *          json - $scope.fancyboxParams = {
                                    enable: true,
                                    isFile: true,
                                    html: '/html/vote.html',
                                    params: {
                                        type: 'iframe',     //inline or iframe
                                        helpers: {
                                            overlay: {
                                                closeClick: false
                                            }
                                    }
                                        }
                   }
 */
uiDirectiveModule.directive('generalFancybox', ['ajax', function (ajax) {
    var obj = {};

    obj.restrict = 'A';
    obj.scope = {
        generalFancybox: '='
    }

    obj.link = function ($scope, $element, $attr) {
        var openBox = function () {
            if ($scope.generalFancybox.enable) {
                if (angular.equals($scope.generalFancybox.params.type, 'iframe')) {        //iframe模式，載入指定的外部html檔案後開啟
                    $.fancybox($scope.generalFancybox.html, $scope.generalFancybox.params);
                } else if (angular.equals($scope.generalFancybox.params.type, 'inline')) {     //inline模式
                    if ($scope.generalFancybox.isFile) {       //指定來源為外部檔案，以非同步方式取得指定的外部html檔案內容後開啟
                        ajax.get($scope.generalFancybox.html).then(function (response) {
                            if (response.status === 200) {
                                $.fancybox(response.data, $scope.generalFancybox.params);
                            }
                        });
                    } else {        //指定來源為html字串，直接使用
                        $.fancybox($scope.generalFancybox.html, $scope.generalFancybox.params);
                    }
                }
            }
        }

        $element.on('click', openBox);
    }

    return obj;
}]);

/**
 * @description 使用 a 標籤簡易方式開啟 fancybox 燈箱效果
 * @requires 需先載入 fancybox.js 主檔
 * @example html - <a class="fancybox.iframe (fancybox open mode)" href="link (file or http link)" easy-fancybox="params (fancybox config params)"></a>
 *          json - $scope.fancyboxParams = {
                        isOpen: true,
                        params: {
                            helpers: {
                                overlay: {
                                    closeClick: false
                                }
                            }
                        }
                    }
 */
uiDirectiveModule.directive('easyFancybox', [function () {
    var obj = {};

    obj.restrict = 'A';
    obj.scope = {
        easyFancybox: '='
    }

    obj.link = function ($scope, $element, $attr) {
        if (angular.isObject($scope.easyFancybox)) {
            if ($scope.easyFancybox.enable && $attr.ngHref) {
                $element.fancybox($scope.easyFancybox.params);
            }
        }
    }

    return obj;
}]);

/**
 * @description Jquery ProgressBar 進度條
 * @requires 需先載入 Jquery ProgressBar UI 主檔
 * @example Html - <div progress-bar="progressValue" progress-style="progressStyle"></div>
            Json - $scope.progressValue = 88        //進度條值
                   $scope.progressStyle = {     //樣式
                        outer: {
                            background: 'none',
                            border: 'none',
                            height: '50px',
                            width: 'auto'
                        },
                        inner: {
                            background: '#af0000',
                            border: 'none',
                            margin: '0'
                        }
    }
 */
uiDirectiveModule.directive('progressBar', [function () {
    var obj = {};

    obj.restrict = 'A';
    obj.scope = {
        progressBar: '=',
        progressStyle: '='
    }

    obj.link = function ($scope, $element, $attr) {
        $element.progressbar({
            value: $scope.progressBar,
            max: 100
        }).css($scope.progressStyle.outer)      //外層樣式
            .find('div').css($scope.progressStyle.inner);       //內層樣式

        $scope.$watch('progressBar', function (newVal, oldVal) {
            if (newVal) {
                $element.progressbar('option', 'value', parseInt(newVal, 10));
            }
        });
    }

    return obj;
}]);

/**
 * @description Bootstrap 日期時間選擇器
 * @link http://www.malot.fr/bootstrap-datetimepicker/index.php
 * @requires jquery.js、bootstrap-datetimepicker.js、bootstrap-datetimepicker.zh-TW.js、bootstrap-datetimepicker.css、
 * @example Html - <input type="text" ng-model="selectDate" date-time-picker="dateTimePickerParams" />
 *          Json - $scope.dateTimePickerParams = {
                    autoClose: true,
                    todayBtn: true,
                    todayHighlight: true,
                    language: 'zh-TW',
                    format: 'yyyy-mm-dd',
                    minView: 'month'
                }
 */
uiDirectiveModule.directive('dateTimePicker', [function () {
    var obj = {};

    obj.require = 'ngModel';
    obj.restrict = 'A';

    obj.scope = {
        dateTimePicker: '='
    }

    obj.link = function ($scope, $element, $attr) {
        $element.datetimepicker($scope.dateTimePicker);
    }

    return obj;
}]);

/**
 * @description - 讀取程序動畫特效
 * @example - 1. <loader-progress-type2 is-show="true or false" anim-type="1 or 2"></loader-progress-type2>
 *            2. <div loader-progress-type2 is-show="true or false" anim-type="1 or 2"></div>
 * @requires - public-loader-animate.css (css動畫主檔)
 */
uiDirectiveModule.directive('loaderProgress', [function () {
    var obj = {}

    obj.restrict = 'AE';
    obj.template = '<div>Loading ...</div>';
    obj.scope = {
        isShow: '=',
        animType: '@'
    }
    obj.link = function ($scope, $element, $attr) {
        $element.find('div').eq(0).addClass('anim-loader-type-' + $scope.animType);
        $scope.$watch('isShow', function (newVal, oldVal) {
            if (newVal) {
                $element.show();
            } else {
                $element.hide();
            }
        });
    }

    return obj;
}]);

/**
 * @description 要求必填欄位的紅色星號
 * @example <require-star></require-star>
 */
uiDirectiveModule.directive('requireStar', [function () {
    var obj = {};

    obj.restrict = 'AE';
    obj.replace = true;
    obj.template = '<span style="color: red; font-size: 1.3em; vertical-align: middle; margin: 0 3px;">*</span>';

    return obj;
}]);

/**
 * @description 套用 flickity 輪播 UI 元件
 * @link http://flickity.metafizzy.co/
 * @requires flickity.pkgd.js
 */
uiDirectiveModule.directive('flickityComponent', ['$timeout', function ($timeout) {
    var obj = {};

    obj.restrict = 'A';
    obj.scope = {
        flickityComponent: '=',     //flickity 設定參數
        playAfterPlay: '='      //點擊後是否繼續撥放
    };

    obj.link = function ($scope, $element, $attr) {

        //需使用延遲以防輪播資料尚未準備完成產生錯誤
        $timeout(function () {
            if ($element.children().length > 0) {
                $scope.$apply(function () {
                    var $flickity = $element.flickity($scope.flickityComponent);
                    $flickity.on('click', function () {
                        if ($scope.playAfterPlay) {
                            $flickity.flickity('playPlayer');
                        }
                    });
                });
            }
        }, 300);
    }

    return obj;
}]);

//一般指令模組
var generalDirectiveModule = angular.module('generalDirectiveModule', []);

/**
* @description - 關注當前目標元素
* @example - <input type="text" focus-me="是否關注(布林值)" />
*/
generalDirectiveModule.directive('focusMe', ['$timeout', 'tool', function ($timeout, tool) {
    var obj = {};
    obj.restrict = 'A';
    obj.scope = { focusMe: '=' }
    obj.link = function ($scope, $element, $attr) {
        var checkFocus = function (sw) {
            if (sw) {
                $timeout(function () {
                    $element.focus();
                });
            }
        }

        $scope.$watch('focusMe', checkFocus);
    }

    return obj;
}]);

/**
 * @description - URL網址返回
 * @example - 1. <div url-back hidden-mode="none or hidden"></div>
 *            2. <url-back hidden-mode="none or hidden" />
 */
generalDirectiveModule.directive('urlBack', ['$window', '$location', function ($window, $location) {
    var obj = {};
    obj.restrict = 'AE';
    obj.link = function ($scope, $element, $attr) {

        //監聽目前位置若為根目錄，則隱藏返回功能
        $scope.location = $location;
        $scope.$watch('location.url()', function (newVal, oldVal) {

            //判斷隱藏功能是以 display none 或者 visibility hidden 進行隱藏
            if (angular.equals(angular.lowercase($attr.hiddenMode), 'none')) {
                if (angular.equals(newVal, '/')) {
                    $element.hide();
                } else {
                    $element.show();
                }
            } else {
                $element.css('visibility', ((angular.equals(newVal, '/')) ? 'hidden' : 'visible'));
            }
        });

        //點擊返回上一頁
        $element.on('click', function () {
            $window.history.back();
        });
    }

    return obj;
}]);

/**
 * @description - 限制當元素內部捲動時，關閉視窗捲動功能
 */
generalDirectiveModule.directive('limitInnerScroll', [function () {
    var obj = {};

    obj.link = function ($scope, $element, $attr) {
        $element.on('mouseover', function () {
            if ($element[0].clientHeight != $element[0].scrollHeight) {
                angular.element('body').css('overflow', 'hidden');
            }
        }).on('mouseout', function (e) {
            angular.element('body').css('overflow', 'auto');
        });
    }

    return obj;
}]);

/**
 * @description 限制輸入鍵盤符號為數字格式
 * @example <input type="number" number-only />
 */
generalDirectiveModule.directive('numberOnly', [function () {
    var obj = {};

    obj.link = function ($scope, $element, $attr) {
        $element.on('keydown', function (event) {
            if (!(event.keyCode == 8        //倒退
                || event.keyCode == 9      //tab
                || event.keyCode == 46      //刪除
                || (event.keyCode <= 57 && event.keyCode >= 48)     //橫向0-9
                || (event.keyCode <= 105 && event.keyCode >= 96)        //九宮格0-9
                || (event.keyCode <= 40 && event.keyCode >= 37))) {     //上下左右
                return false;
            }
        });
    }

    return obj;
}]);

/**
 * @description 將繫結在 ngModel 的值轉為字串型態輸出，數字型態輸入
 * @requires ngModel
 * @example <input type="text" ng-model="myModel" ng-model-num-in-str-out /> 
 */
generalDirectiveModule.directive('ngModelNumInStrOut', function () {
    var obj = {};

    obj.require = 'ngModel'

    obj.link = function ($scope, $element, $attr, ngModel) {

        //view -> model
        ngModel.$parsers.push(function (data) {
            return Number(data);
        });

        //model -> view
        ngModel.$formatters.push(function (data) {
            return String(data);
        });
    }

    return obj;
});