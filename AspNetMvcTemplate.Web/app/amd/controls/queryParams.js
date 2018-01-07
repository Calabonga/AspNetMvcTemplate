define(["knockout", "config", "engine/common/framework"],
    function (ko, config, site) {

        var factory = function (options) {
            return new create(options);
        }
        var create = function (options) {
            var settings = { pageIndex: 1, pageSize: config.pageSize || 10 };

            site.extend(settings, options);

            var
                sizes = [1, 5, 10, 30, 50, 100, 500, 1000],
                pageIndex = ko.observable(settings.pageIndex),
                pageSize = ko.observable(settings.pageSize),
                search = ko.observable("").extend({ rateLimit: config.throttle || 400 });

            return {
                sizes: sizes,
                search: search,
                pageSize: pageSize,
                pageIndex: pageIndex
            };
        };

        return {
            getInstance: function (options) {
                return new factory(options);
            }
        };
    });