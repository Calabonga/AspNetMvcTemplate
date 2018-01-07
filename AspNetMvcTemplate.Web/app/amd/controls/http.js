define(function (require) {
    const
         system = require("durandal/system"),
         site = require("engine/common/framework");

    var create = function (options) {
        var
        defaults = {
            dataType: "json",
            crossDomain: false,
            contentType: "application/json; charset=utf-8",
            type: "GET",
            headers: {},
            cache: false,
            async: true
        },
        http = function (url, data, httpOptions) {
            site.extend(defaults, httpOptions);
            system.log("ENGINE: Executing request to URL:" + url + " with params: " + JSON.stringify(data) + "(settings: " + JSON.stringify(defaults) + ")");
            return $.ajax({
                url: url,
                dataType: defaults.dataType,
                crossDomain: defaults.crossDomain,
                contentType: defaults.contentType,
                data: data,
                type: defaults.type,
                headers: defaults.headers,
                cache: defaults.cache
            });
        },

        getHtml = function (url, data) {
            return http(url, data, {dataType: "HTML"});
        },

        httpGetJson = function (url, data) {
            return http(url, data);
        },

        httpPostJson = function (url, data) {
            return http(url, data, { type: "POST" });
        };


        return {
            http: http,
            getHtml: getHtml,
            settings: defaults,
            getJSON: httpGetJson,
            postJSON: httpPostJson
        }
    },
    factory = function (options) {
        return new create(options);
    }

    return {
        getInstance: function (options) {
            return new factory(options);
        }
    };
});

