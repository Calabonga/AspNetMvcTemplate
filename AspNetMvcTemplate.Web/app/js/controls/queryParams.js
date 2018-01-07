Site.QueryParams = function () {

    var
        create = function (options) {
            // your code goes here
            var settings = { pageIndex: 1, pageSize: Site.cfg.defaultPageSize || 10 };

            Site.Extend(settings, options);

            var
                pageIndex = ko.observable(settings.pageIndex),
                pageSize = ko.observable(settings.pageSize),
                search = ko.observable("").extend({ rateLimit: Site.cfg.throttle || 400 });

            return {
                pageIndex: pageIndex,
                pageSize: pageSize,
                search: search
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