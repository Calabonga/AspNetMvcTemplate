Site.ServiceSettings = function () {

    var create = function (options) {
        var settings = { timeout: 10000, dataType: "json" };
        Site.Extend(settings, options);
        return {
            timeout: settings.timeout,
            dataType: settings.dataType,
            success: function () {
                alert("Success!");
            },
            error: function () {
                alert("Error!");
            }
        };
    },
    factory = function (options) {
        return new create(options);
    }

    return {
        getInstance: function (options) {
            return new factory(options);
        }
    };

}();