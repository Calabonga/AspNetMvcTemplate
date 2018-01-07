define(function (require) {
    "use strict";

    const
        ko = require("knockout"),
        config = require("config"),
        site = require("engine/common/framework"),
        logger = require("engine/controls/logger"),
        modalWindow = require("engine/controls/modalWindow"),
        operationResult = require("engine/controls/operationResult");


    var factory = function (options) {
        return new create(options);
    }

    function create(options) {

        var ctrl = this;
        if (!options || !options.value || !ko.isObservable(options.value)) {
            throw new Error("DbLookUp value should be an observable");
        }
        ctrl.context = options.context || {},
        ctrl.dialogResult = false,
        ctrl.settings = {
            isEditable: true,
            dblookupImageName: config.dblookupReadyImageName,
            dblookupBusyAnimantionImageName: config.dblookupBusyImageName,
            selectedTextLabel: "Выбор",
            notSelectedTextLabel: "Сделай правильный выбор",
            placeholder: "",
            title: "Выбор",
            events: {
                onClosed: null,
                onOpened: null,
                onSelectionChanged: null
            },
            getLookup: "getItemById"
        };
        ctrl.getResult = function (control) {
            return {
                title: control.title,
                context: control.context,
                uniqueId: control.uniqueId,
                model: control.selectedItem(),
                dialogResult: ctrl.dialogResult,
                selectedText: ctrl.selectedText(),
                selectedValue: ctrl.selectedValue()
            }
        };
        ctrl.uniqueId = site.guid();
        ctrl.selectedItem = ko.observable();
        ctrl.selectedText = ko.observable();
        ctrl.pagedList = options.pagedList;
        ctrl.propertyText = options.propertyText || "name";
        ctrl.propertyValue = options.propertyValue || "id";
        ctrl.selectedValue = options.value.extend({ rateLimit: config.throttle || 300 });;
        ctrl.fieldTemplate = '<div class="input-group">\
                                <input type="text" class="form-control" disabled data-bind="value: selectedText, attr: {title: selectedValue,  placeholder: placeholder}" readonly=\"readonly\"  />\
                                <div class="input-group-btn">\
                                    <button type="button" class="btn btn-primary" data-bind="enable: isEnabled, click: openSelector" title="выбрать из списка">\
                                        <span data-bind="visible: !pagedList.indicator.isbusy()"><img data-bind="attr: { src: settings.dblookupImageName }" /></span>\
                                        <i data-bind="visible: pagedList.indicator.isbusy()"><img data-bind="attr: { src: settings.dblookupBusyAnimantionImageName }" /></i>\
                                    </button>\
                                </div>\
                            </div>';
        if (!ctrl.pagedList) { throw new Error("PagedList required for DbLookup!"); }
        site.extend(ctrl.settings, options);
        ctrl.selectorModel = {
            settings: ctrl.settings,
            selectedText: ctrl.selectedText,
            selectedValue: ctrl.selectedValue,
            placeholder: ctrl.settings.placeholder,
            openSelector: function () {
                ctrl.pagedList.reload();
                return new Promise(function (resolve, reject) {
                    if (ctrl.settings.events.onOpened) ctrl.settings.events.onOpened();
                    if (ctrl.settings.showErrorsOnOpen) {
                        ctrl.model().errors.showAllMessages(true);
                    }
                    modalWindow.getInstance({
                        control: ctrl,
                        windowOptions: { keyboard: false, backdrop: "static" },
                        onClosed: ctrl.settings.events.onClosed,
                        deffered: resolve
                    });
                });
            },
            isEnabled: ko.computed(function () {
                return !ctrl.pagedList.indicator.isbusy() && ctrl.settings.isEditable;
            }),
            pagedList: ctrl.pagedList
        };
        ctrl.title = ctrl.settings.title;
        ctrl.modalWindowContentTemplate = '<p>\
                                                <!-- ko if: selectedText -->\
                                                <span class=\"text-info\" data-bind=\"text: settings.selectedTextLabel\"></span>:\
                                                <b class=\"text-info\" data-bind=\"text: selectedText\"></b>\
                                                <!-- /ko -->\
                                                <!-- ko ifnot: selectedText -->\
                                                <b class=\"text-info\" data-bind=\"text: settings.notSelectedTextLabel\"></b>\
                                                <!-- /ko -->\
                                            </p>\
                                           <div class="margin-sm" data-bind="pagedList: pagedList"></div>';
        ctrl.modalWindowTemplate = '<div id="b' + ctrl.uniqueId + '" class="modal fade" tabindex="-1" role="dialog">\
                                    <div class="modal-dialog" role="document">\
                                        <div class="modal-content">\
                                            <div id="h' + ctrl.uniqueId + '" class="modal-header">\
                                                <button type="button" class="close" data-bind="click: close" aria-hidden="true">&times;</button>\
                                                <h4 class="modal-title" data-bind="text: title"></h4>\
                                            </div>\
                                            <div id="c' + ctrl.uniqueId + '" class="modal-body"></div>\
                                            <div id="f' + ctrl.uniqueId + '" class="modal-footer">\
                                                <button type="button" class="btn btn-primary" data-bind="enable: canSelect, click: select" >Выбор</button>\
                                                <button type="button" class="btn btn-default" data-bind="enable: canReset, click: reset" >Сброс</button>\
                                                <button type="button" class="btn btn-default" data-bind="click: close" >Закрыть</button>\
                                            </div>\
                                        </div>\
                                    </div>\
                                </div>';
        ctrl.select = function () {
            if (ctrl.pagedList.selectedItem && ctrl.pagedList.selectedItem()) {
                var item = ctrl.pagedList.selectedItem();
                ctrl.setSelectedItem(item);
                ctrl.close();
            }
        };
        ctrl.reset = function () {
            ctrl.setSelectedItem(null);
            ctrl.dialogResult = false;
            ctrl.close();
        };
        ctrl.close = function () {
            if (ctrl) {
                var f = $("#b" + ctrl.uniqueId);
                if (f) {
                    f.modal('hide');
                }
            }
        };
        ctrl.setSelectedItem = function (item) {
            if (item) {
                var valueChanged = ctrl.selectedValue && (ctrl.selectedValue() !== item[ctrl.propertyValue]);
                var textLoaded = ctrl.selectedValue && ctrl.selectedValue();
                if (textLoaded||valueChanged) {
                    ctrl.selectedItem(item);
                    ctrl.selectedText(item[ctrl.propertyText]);
                    ctrl.selectedValue(item[ctrl.propertyValue]);
                    ctrl.dialogResult = true;
                    if (ctrl.settings.events.onSelectionChanged) ctrl.settings.events.onSelectionChanged(ctrl.getResult(ctrl));
                }
            } else {
                const current = ctrl.selectedValue();
                ctrl.selectedItem(null);
                ctrl.selectedText(null);
                ctrl.selectedValue(null);
                if (current !== item) {
                    if (ctrl.settings.events.onSelectionChanged) ctrl.settings.events.onSelectionChanged(ctrl.getResult(ctrl));
                }
            }
        };
        ctrl.loadCurrentValue = function () {
            ctrl.pagedList.indicator.show();
            var method = ctrl.pagedList.service[ctrl.settings.getLookup];
            if (!site.isFunction(method)) {
                throw new Error("Get LookUp method is not found!");
            }
            if (ctrl.selectedValue && ctrl.selectedValue()) {
                var key = ctrl.selectedValue();
                method(key).then(function (response) {
                    var result = operationResult.build(response, ctrl.pagedList.service.defaultMapper, true).result;
                    if (response && response.ok) {
                        var item = ctrl.pagedList.service.defaultMapper(result);
                        ctrl.setSelectedItem(item);
                    } else {
                        
                    }
                }).fail(function () {
                    logger.error("Can't initialize DbLookUp");
                }).always(function () {
                    ctrl.pagedList.indicator.hide();
                });
            }
        };
        ctrl.canSelect = ko.computed(function () {
            return ctrl.pagedList && ctrl.pagedList.selectedItem && ctrl.pagedList.selectedItem();
        });
        ctrl.canReset = ko.computed(function () {
            return ctrl.selectedItem && ctrl.selectedItem();
        });
        ctrl.selectedValue.subscribe(function (value) {
            if (value && ctrl.selectedText() === null) {
                ctrl.loadCurrentValue();
            }
        });
        ctrl.init = function () {
            var hasInitialValue = (ctrl.selectedValue && ctrl.selectedValue());
            if (hasInitialValue) {
                ctrl.loadCurrentValue();
            }
        }();

        return {
            close: ctrl.close,
            title: ctrl.title,
            reset: ctrl.reset,
            select: ctrl.select,
            settings: ctrl.settings,
            uniqueId: ctrl.uniqueId,
            canSelect: ctrl.canSelect,
            pagedList: ctrl.pagedList,
            selectedText: ctrl.selectedText,
            selectedValue: ctrl.selectedValue,
            fieldTemplate: ctrl.fieldTemplate,
            selectorModel: ctrl.selectorModel,
            modalWindowTemplate: ctrl.modalWindowTemplate,
            modalWindowContentTemplate: ctrl.modalWindowContentTemplate,
        };
    }

    return {
        getInstance: function (options) {
            return new factory(options);
        }
    }
});