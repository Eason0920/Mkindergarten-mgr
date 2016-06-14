using System.Web.Mvc;
using System.Web.Routing;

namespace mkindergartenHeadManage
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            //取消網站圖標的路由請求
            routes.IgnoreRoute("favicon.ico");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Index", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}

