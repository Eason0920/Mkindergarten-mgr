using System.Web.Optimization;

namespace mkindergartenHeadManage
{
    public class BundleConfig
    {
        // For more information on bundling, visit http://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            bundles.Add(new ScriptBundle("~/bundles/public").Include(
                      "~/Scripts/jquery-{version}.js",
                      "~/Scripts/angular.js",
                      "~/Scripts/bootstrap.js",
                      "~/Scripts/public-tools.js",
                      "~/Scripts/public-angular-service.js",
                      "~/Scripts/public-angular-directive.js",
                      "~/Scripts/ng-file-upload-shim.js",
                      "~/Scripts/ng-file-upload.js",
                      "~/Scripts/angular-busy.js",
                      "~/Scripts/bootstrap-datetimepicker/bootstrap-datetimepicker.js",
                      "~/Scripts/bootstrap-datetimepicker/locales/bootstrap-datetimepicker.zh-TW.js",
                      "~/Scripts/ngStorage.js"));

            bundles.Add(new ScriptBundle("~/bundles/project").Include(
                        "~/Scripts/app.js",
                        "~/Scripts/app-service.js",
                        "~/Scripts/app-directive.js",
                        "~/Scripts/app-controller.js"));

            bundles.Add(new StyleBundle("~/Content/style").Include(
                      "~/Content/bootstrap.css",
                      "~/Content/site.css",
                      "~/Content/public-style.css",
                      "~/Content/angular-busy.css",
                      "~/Content/bootstrap-datetimepicker.css"));
        }
    }
}
