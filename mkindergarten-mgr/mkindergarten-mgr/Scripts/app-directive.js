//分頁元件 directive
app.directive('pagingComponentDirective', [function () {
    var obj = {};

    obj.restrict = 'AE';

    obj.template = '<div ng-if="pagingAry.length > 1" class="text-right">\
                        <ul class="pagination">\
                            <li ng-style="{\'visibility\': ((curPagingNum === 1) ? \'hidden\' : \'visible\')}">\
                                <a href="javascript:;" ng-click="pagingClick(curPagingNum - 1)">\
                                    <span aria-hidden="true">&laquo;</span><span class="sr-only">Previous</span>\
                                </a>\
                            </li>\
                            <li ng-repeat="count in pagingAry" ng-class="{active: curPagingNum === count}">\
                                <a href="javascript:;" ng-click="pagingClick(count)">{{count}}</a>\
                            </li>\
                            <li ng-style="{visibility: ((curPagingNum == (pagingAry.length)) ? \'hidden\' : \'visible\')}">\
                                <a href="javascript:;" ng-click="pagingClick(curPagingNum + 1)">\
                                    <span aria-hidden="true">&raquo;</span><span class="sr-only">Next</span>\
                                </a>\
                            </li>\
                        </ul>\
                    </div>';

    obj.replace = true;

    obj.link = function ($scope, $element, $attr) { }

    return obj;
}]);