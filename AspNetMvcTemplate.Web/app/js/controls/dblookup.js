Site.DbLookup = function () {
    "use strict";

    var factory = function (options) {
        return new create(options);
    }

    function create(options) {

        var ctrl = this;
        ctrl.settings = {
            isEditable: true,
            selectedTextLabel: "Выбор",
            notSelectedTextLabel: "Сделай правильный выбор",
            placeholder: "",
            title: "Выбор",
            events: {
                onClosed: null,
                onOpened: null
            },
            getLookup: "getItemById"
        };

        ctrl.uniqueId = Site.Guid();
        ctrl.selectedItem = ko.observable();
        ctrl.selectedText = ko.observable();
        ctrl.selectedValue = options.value.extend({ rateLimit: Site.cfg.throttle || 300 });;
        ctrl.pagedList = options.pagedList;
        ctrl.propertyText = options.propertyText || "name";
        ctrl.propertyValue = options.propertyValue || "id";
        ctrl.fieldTemplate = '<div class="input-group">\
                                <input type="text" class="form-control" disabled data-bind="value: selectedText, attr: {title: inputTitle,  placeholder: placeholder}" readonly=\"readonly\"  />\
                                <div class="input-group-btn">\
                                    <button type="button" class="btn btn-primary" data-bind="enable: isEnabled, click: openSelector" title="выбрать из списка">\
                                        <span data-bind="visible: !pagedList.indicator.isbusy()"><img data-bind="attr: { src: Site.cfg.dblookupImageName }" /></span>\
                                        <i data-bind="visible: pagedList.indicator.isbusy()"><img data-bind="attr: { src: Site.cfg.dblookupBusyAnimantion }" /></i>\
                                    </button>\
                                </div>\
                            </div>';
        if (!ctrl.pagedList) { throw new Error("PagedList required for DbLookup!"); }
        Site.Extend(ctrl.settings, options);
        ctrl.selectorModel = {
            selectedText: ctrl.selectedText,
            inputTitle: ctrl.selectedValue,
            placeholder: ctrl.settings.placeholder,
            openSelector: function () {
                ctrl.pagedList.reload();
                Site.ModalWindow(ctrl, { keyboard: false, backdrop: 'static' });
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
                ctrl.selectedItem(item);
                ctrl.selectedText(item[ctrl.propertyText]);
                ctrl.selectedValue(item[ctrl.propertyValue]);
            } else {
                ctrl.selectedItem(null);
                ctrl.selectedText(null);
                ctrl.selectedValue(null);
            }
        };
        ctrl.loadCurrentValue = function () {
            ctrl.pagedList.indicator.show();
            var method = ctrl.pagedList.service[ctrl.settings.getLookup];
            if (!Site.IsFunction(method)) {
                throw new Error("Get LookUp method is not found!");
            }
            if (ctrl.selectedValue && ctrl.selectedValue()) {
                var key = ctrl.selectedValue();
                method(key).then(function (response) {
                    Site.OperationResult.build(response, null, true);
                    if (response && response.ok) {
                        var item = ctrl.pagedList.service.defaultMapper(response.result);
                        ctrl.setSelectedItem(item);
                    }
                }).fail(function () {
                    Site.msg.error("Can't initialize DbLookUp");
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
            if (value && ctrl.selectedText()===null) {
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
}();