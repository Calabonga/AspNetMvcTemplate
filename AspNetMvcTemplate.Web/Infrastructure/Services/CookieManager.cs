using System;
using System.Globalization;
using System.Web;
using System.Web.Caching;

namespace AspNetMvcTemplate.Web.Infrastructure.Services
{
    /// <summary>
    /// Cookies service
    /// </summary>
    public class CookieManager
    {
        public bool GetPoll(string pollName)
        {
            var value = GetCookie(pollName);
            if (value != null)
            {
                return true;
            }
            return false;
        }

        public void SavePoll(string pollName, string answer)
        {
            SetCookieAndCache(pollName, answer);
        }

        /// <summary>
        /// Читать Cookie
        /// </summary>
        /// <param name="cookieName"></param>
        public static string GetCookie(string cookieName)
        {
            var value = HttpContext.Current.Cache.Get(cookieName);
            if (value != null)
            {
                SetCookieAndCache(cookieName, value.ToString());
                return value.ToString();
            }
            return HttpContext.Current.Request.Cookies[cookieName] != null
                ? HttpContext.Current.Request.Cookies[cookieName].Value.ToString(CultureInfo.InvariantCulture)
                : null;
        }

        internal static void SetCookieAndCache(string cookieName, string cookieValue)
        {
            if (cookieValue == null) return;
            var cookie = new HttpCookie(cookieName, cookieValue)
            {
                Expires = string.IsNullOrEmpty(cookieValue) ? DateTime.Now.AddDays(-1) : DateTime.Now.AddDays(30)
            };
            HttpContext.Current.Response.Cookies.Add(cookie);
#if !DEBUG
            HttpContext.Current.Cache.Insert(cookieName, cookieValue, null, Cache.NoAbsoluteExpiration, TimeSpan.FromHours(1), CacheItemPriority.Normal, null);
#endif
        }
    }

}
