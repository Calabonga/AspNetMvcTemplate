Site.Http = function (url, data, options) {
    var defaults = {
        dataType: "json",
        crossDomain: false,
        contentType: "application/json; charset=utf-8",
        type: "GET",
        headers: {},
        cache: false,
        async: true
    };

    Site.Extend(defaults, options);

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
}

Site.HttpGetJSON = function (url, data) {
    return Site.Http(url, data);
}

Site.HttpPostJSON = function (url, data) {
    return Site.Http(url, data, { type: "POST" });
}