define(function (require) {
    const
        ko = require("knockout"),
        config = require("config"),
        system = require("durandal/system"),
        pager = require("engine/controls/pager"),
        site = require("engine/common/framework"),
        logger = require("engine/controls/logger"),
        busyIndicator = require("engine/controls/busyIndicator"),
        queryParamsBuilder = require("engine/controls/queryParams"),
        operationResult = require("engine/controls/operationResult"),
        templateLoaderBuilder = require("engine/controls/templateLoader");

    var create = function (options) {

        function selectItem(item, items) {
            unselect(items);
            if (item.hasOwnProperty("selected")) {
                item.selected(true);
            }
        }

        function unselect(items) {
            items().forEach(function (item) {
                if (item.hasOwnProperty("selected")) {
                    item.selected(false);
                }
            });
        }

        var
            indicator = busyIndicator.getInstance(),
            service = options.service,
            columns = options.columns,
            resetColumnsSorting = function(exceptColumnName) {
                if (columns) {
                    for (var i = 0; i < columns.length; i++) {
                        if (exceptColumnName) {
                            if (columns[i].fieldName === exceptColumnName) {
                                continue;
                            }
                        }
                        columns[i].resetColumnSorting(null);
                    }
                }
            },
            settings = {
                queryParams: queryParamsBuilder.getInstance(),
                autoLoad: false,
                ui: {
                    hideSearch: false,
                    hideSearchLabel: false,
                    pagerBeforeGrid: false
                },
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
                visibleGroupCount: options.visibleGroupCount || config.visibleGroupCount || 10,
                itemTemplate: null,
                isDebug: false,
                templateLoader: templateLoaderBuilder
                    .getInstance({ folder: options.templateFolder || config.templateFolderUrl || "/templates" }),
                mapper: null
            },
            pages = ko.observableArray([]),
            items = ko.observableArray([]),
            selectedItem = ko.observable(),
            totalCount = ko.observable(0),
            totalPages = ko.observable(0),
            hasItems = ko.computed(function() {
                return items().length > 0;
            }),
            templateHeaderColumn = "<tr data-bind=\"foreach: $data.columns\">\
                                        <!-- ko if: fieldName -->\
                                            <td data-bind=\"attr: {css: settings.css}, click: $parent.changeSortDirection\" style=\"cursor:pointer;\">\
                                                <span data-bind=\"text: displayName\"></span>\
                                                <i data-bind=\"css: currentDirection.image\"></i>\
                                            </td>\
                                        <!-- /ko -->\
                                        <!-- ko ifnot: fieldName -->\
                                            <td data-bind=\"attr: {css: settings.css}\">\
                                                <span data-bind=\"text: displayName\"></span>\
                                            </td>\
                                        <!-- /ko -->\
                                    </tr>",
            templatePager = "<div data-bind=\"if: pagedList.totalPages()>1\">\
                                <ul data-bind=\"foreach: pagedList.pages\" class=\"pagination pagination-sm\">\
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
            templateControlMarkup = function(html) {
                return "<div data-bind=\"indicate: pagedList.indicator\">\
                            <p data-bind=\"ifnot: pagedList.hideSearch\">\
                                <!-- ko ifnot: pagedList.hideSearchLabel -->\
                                    <label>" + config.pagedListSearchLabel + "</label>\
                                <!-- /ko -->\
                                <div class=\"input-group\"><span class=\"input-group-addon\"><i class=\"fa fa-filter\"></i></span>\
                                <input type=\"text\" class=\"form-control input-sm\" data-bind=\"enabled: !pagedList.indicator.isbusy, value: pagedList.queryParams.search, valueUpdate: 'afterkeydown'\"/>\
                            </div></p>\
                            <!-- ko if: pagedList.items -->" +
                    html +
                    "<!-- /ko -->\
                            " +
                    templatePager +
                    "\
                        </div>";
            },
            loadTemplate = function() {
                if (!settings.itemTemplate) {
                    settings.itemTemplate = config.dblookup.defaultLookupTemplate || "default-dblookup-template";
                }
                return settings.templateLoader.loadTemplate(settings.itemTemplate, templateControlMarkup);
            },
            buildSortDefinitions = function() {
                if (columns && columns.length) {
                    var sortDefinition = ko.utils.arrayFirst(columns,
                        function(column) {
                            return column.currentDirection.direction();
                        });

                    if (sortDefinition) {
                        var sortDefinitions = ko.utils.arrayMap([sortDefinition],
                            function(column) {
                                return { key: column.fieldName, sortDirection: column.currentDirection.direction() }
                            });

                        if (sortDefinitions && sortDefinitions.length) {
                            settings.queryParams.sortDefinitions = sortDefinitions;
                        }
                    }
                }
            },
            changeSortDirection = function(column) {
                var activeColumn = ko.utils.arrayFirst(columns,
                    function(item) {
                        return item.fieldName === column.fieldName;
                    });
                var current = activeColumn.currentDirection.direction();
                resetColumnsSorting(activeColumn.fieldName);
                if (current === "descending") {
                    activeColumn.setSortDirection("ascending");
                } else {
                    activeColumn.setSortDirection("descending");
                }
                buildSortDefinitions();
                getData(settings.queryParams);
            };

        site.extend(settings, options);

        //#region extend properties and check
        if (!service) {
            let message = "ENGINE: Service fot PagedList does not provided!";
            system.log(message);
            throw new Error(message);
        }
        if (options.queryParams) {
            var isObservable = false,
                params = options.queryParams,
                sourceValue = undefined;

            for (prop in params) {
                if (!params.hasOwnProperty(prop)) {
                    continue;
                }
                if (ko.isWriteableObservable(params[prop])) {
                    isObservable = true;
                    sourceValue = params[prop]();
                } else if (typeof (params[prop]) !== "function") {
                    sourceValue = params[prop];
                }
                if (ko.isWriteableObservable(settings.queryParams[prop])) {
                    settings.queryParams[prop](sourceValue);
                } else if (settings.queryParams[prop] === null || settings.queryParams[prop] === undefined) {
                    settings.queryParams[prop] = isObservable ? ko.observable(sourceValue) : sourceValue;
                } else if (typeof (settings.queryParams[prop]) !== "function") {
                    settings.queryParams[prop] = sourceValue;
                }
                isObservable = false;
            }
            buildSortDefinitions();
        }

        var
            clear = function () {
                items([]);
            },
            getData = function (queryParams) {
                indicator.show();
                var pagedMethod = service[settings.queries.getPagedList];
                if (pagedMethod) {
                    pagedMethod(queryParams)
                        .then(function (response) {
                            pages(pager.getInstance(response.result, settings));
                            totalCount(response.result.totalCount);
                            totalPages(response.result.totalPages);
                            if (service.defaultMapper) {
                                var result = operationResult.build(response, service.defaultMapper).result;
                                items(result);
                                if (settings.events.onPageLoaded) {
                                    settings.events.onPageLoaded(response);
                                }
                            } else {
                                items(response.result.items);
                            }
                        }).fail(function (error) {
                            logger.error(error.statusCode + ": Сервис не доступен или вернул ошибку");
                        }).always(function () {
                            indicator.hide();
                        });
                }
            },
            reload = function () {
                selectedItem(null);
                getData(settings.queryParams);
            },
            selectPage = function (page) {
                if (!page) return;
                settings.queryParams.pageIndex(page.pageIndex);
                selectedItem(null);
                getData(settings.queryParams);
            },
            select = function (item) {
                selectedItem(item);
                selectItem(item, items);
            },
            resetSelection = function () {
                unselect(items);
            },
            replaceWith = function (item, predicate) {
                var old = ko.utils.arrayFirst(items(), predicate);
                var index = items.indexOf(old);
                items.splice(index, 1, item);
            };

        if (settings.autoLoad) {
            getData(settings.queryParams);
        }

        settings.queryParams.search.subscribe(function () {
            clear();
            getData(settings.queryParams);
        });
        settings.queryParams.pageSize.subscribe(function () {
            clear();
            getData(settings.queryParams);
        });
        return {
            items: items,
            pages: pages,
            select: select,
            reload: reload,
            columns: columns,
            service: service,
            hasItems: hasItems,
            indicator: indicator,
            selectPage: selectPage,
            totalPages: totalPages,
            totalCount: totalCount,
            replaceWith: replaceWith,
            unselect: resetSelection,
            loadTemplate: loadTemplate,
            selectedItem: selectedItem,
            queryParams: settings.queryParams,
            hideSearch: settings.ui.hideSearch,
            changeSortDirection: changeSortDirection,
            templateHeaderColumn: templateHeaderColumn,
            hideSearchLabel: settings.ui.hideSearchLabel
        }
    }

    var factory = function (options) { return new create(options); }

    return {
        getInstance: function (options) {
            return new factory(options);
        }
    };
});