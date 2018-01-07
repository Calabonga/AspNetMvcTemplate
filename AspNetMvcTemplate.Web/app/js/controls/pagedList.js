Site.PagedList = function() {

    var factory = function(options) {
        return new create(options);
    }

    var create = function(options) {

        function selectItem(item, items) {
            unselect(items);
            if (item.hasOwnProperty("selected")) {
                item.selected(true);
            }
        }

        function unselect(items) {

            items().forEach(function(item) {
                if (item.hasOwnProperty("selected")) {
                    item.selected(false);
                }
            });
        }

        var
            settings = {
                queryParams: Site.QueryParams.getInstance(),
                autoLoad: false,
                ui: {
                    hideSearch: false,
                    hideSearchLabel: false,
                    pagerBeforeGrid: false
                },
                service: null,
                queries: {
                    "getAllList": "getAllList",
                    "getPagedList": "getPagedList",
                    "getItemById": "getItemById",
                    "insertItem": "insertItem",
                    "updateItem": "updateItem",
                    "deleteItem": "deleteItem"
                },
                events: {
                    onPageLoaded: null
                },
                visibleGroupCount: 10,
                itemTemplate: null,
                isDebug: false,
                templateLoader: Site.TemplateLoader.getInstance({ folder: "/templates" }),
                mapper: null
            },
            indicator = Site.BusyIndicator.getInstance(),
            pages = ko.observableArray([]),
            items = ko.observableArray([]),
            selectedItem = ko.observable(),
            totalPages = ko.observable(0),
            hasItems = ko.computed(function() {
                return items().length > 0;
            }),
            templatePager = "<div data-bind=\"if: pagedList.totalPages()>1\">\
                                <ul id=\"pager\" data-bind=\"foreach: pagedList.pages\" class=\"pagination pagination-sm\">\
                                    <li data-bind=\"css: css\">\
                                        <!-- ko if: mode == 1 -->\
                                            <span><span aria-hidden=\"true\" data-bind=\"html: text\"></span></span>\
                                        <!-- /ko  -->\
                                        <!-- ko if: mode == 2 -->\
                                            <span data-bind=\"html: text\"> <span class=\"sr-only\">(current)</span></span>\
                                        <!-- /ko  -->\
                                        <!-- ko if: mode == 0 -->\
                                            <a href=\"#\" data-bind=\"html: text, click: $parent.pagedList.selectPage\"></a>\
                                        <!-- /ko  -->\
                                    </li>\
                                </ul>\
                            </div>",
            templateControl = function(html) {
                return "<div data-bind=\"indicate: pagedList.indicator\">\
                            <p data-bind=\"ifnot: pagedList.hideSearch\">\
                                <!-- ko ifnot: pagedList.hideSearchLabel -->\
                                    <label>" + Site.cfg.pagedListSearchLabel + "</label>\
                                <!-- /ko -->\
                                <div class=\"input-group\"><span class=\"input-group-addon\"><i class=\"glyphicon glyphicon-filter\"></i></span>\
                                <input type=\"text\" class=\"form-control input-sm\" data-bind=\"value: pagedList.queryParams.search, valueUpdate: 'afterkeydown'\"/>\
                            </div></p>\
                            <!-- ko if: pagedList.items -->" + html + "<!-- /ko -->\
                            " + templatePager + "\
                        </div>";
            },
            loadTemplate = function() {
                return settings.templateLoader.loadTemplate(settings.itemTemplate, templateControl);
            };

        Site.Extend(settings, options);

        //#region extend properties and check

        if (options.queryParams) {

            var isObservable = false,
                sourceValue = undefined,
                queryParams = options.queryParams;

            for (prop in queryParams) {
                if (!queryParams.hasOwnProperty(prop)) {
                    continue;
                }
                if (ko.isWriteableObservable(queryParams[prop])) {
                    isObservable = true;
                    sourceValue = queryParams[prop]();
                } else if (typeof(queryParams[prop]) !== 'function') {
                    sourceValue = queryParams[prop];
                }
                if (ko.isWriteableObservable(settings.queryParams[prop])) {
                    settings.queryParams[prop](sourceValue);
                } else if (settings.queryParams[prop] === null || settings.queryParams[prop] === undefined) {
                    settings.queryParams[prop] = isObservable ? ko.observable(sourceValue) : sourceValue;
                } else if (typeof(settings.queryParams[prop]) !== 'function') {
                    settings.queryParams[prop] = sourceValue;
                }
                isObservable = false;
            }
        }

        var
            clear = function() {
                items([]);
            },
            getData = function(queryParams) {
                indicator.show();
                var pagedMethod = settings.service[settings.queries.getPagedList];
                if (pagedMethod) {
                    pagedMethod(queryParams)
                        .then(function(response) {
                            pages(new Site.Pager(response.result, settings));
                            totalPages(response.result.totalPages);
                            if (settings.service.defaultMapper) {
                                var result = Site.OperationResult.build(response, settings.service.defaultMapper).result;
                                items(result);
                                if (settings.events.onPageLoaded) {
                                    settings.events.onPageLoaded(result);
                                }
                            } else {
                                items(response.result.items);
                            }
                        }).fail(function(error) {
                            Site.Logger.error(error.statusCode + ": Сервис не доступен или вернул ошибку");
                        }).always(function() {
                            indicator.hide();
                        });
                }
            },
            reload = function() {
                selectedItem(null);
                getData(settings.queryParams);
            },
            selectPage = function(page) {
                if (!page) return;
                settings.queryParams.pageIndex(page.pageIndex);
                selectedItem(null);
                getData(settings.queryParams);
            },
            select = function(item) {
                selectedItem(item);
                selectItem(item, items);
            },
            resetSelection = function() {
                unselect(items);
            };

        if (settings.autoLoad) {
            getData(settings.queryParams);
        }

        settings.queryParams.search.subscribe(function() {
            clear();
            getData(settings.queryParams);
        });

        return {
            items: items,
            pages: pages,
            select: select,
            reload: reload,
            hasItems: hasItems,
            indicator: indicator,
            selectPage: selectPage,
            totalPages: totalPages,
            service: settings.service,
            selectedItem: selectedItem,
            loadTemplate: loadTemplate,
            unselect: resetSelection,
            queryParams: settings.queryParams,
            hideSearch: settings.ui.hideSearch,
            hideSearchLabel: settings.ui.hideSearchLabel
        }

    }

    return {
        getInstance: function(options) {
            return new factory(options);
        }
    };

}();