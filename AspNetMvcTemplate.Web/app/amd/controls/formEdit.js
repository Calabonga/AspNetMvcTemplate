define(function (require) {
    const
        ko = require("knockout"),
        site = require("engine/common/framework"),
        dialog = require("engine/controls/dialog"),
        indicator = require("engine/controls/busyIndicator"),
        modalWindow = require("engine/controls/modalWindow");

    var factory = function (options) {
        return new formEdit(options);
    }

    var formEdit = function (options) {

        var ctrl = this;
        ctrl.indicator = indicator.getInstance();
        ctrl.context = {};
        ctrl.dialogResult = false;
        ctrl.getResult = function (control) {
            return {
                indicator : ctrl.indicator,
                model: control.model(),
                context: control.context,
                title: control.title,
                uniqueId: control.uniqueId,
                dialogResult: ctrl.dialogResult,
                onComplete: ctrl.onComplete
            }
        };
        ctrl.onComplete = function () {
            ctrl.dialogResult = true;
            if (ctrl.model && ctrl.model()) {
                ctrl.model()._dirtyFlag().reset();
            }
            ctrl.close();
        };
        ctrl.model = ko.observable();
        ctrl.uniqueId = site.guid();
        ctrl.settings = {
            title: "Untitled",
            templateUrl: null,
            events: {
                onClosed: null,
                onOpened: null,
                onSave: null,
                onCancel: null
            },
            showErrorsOnOpen: true
        };
        site.extend(ctrl.settings, options);
        ctrl.title = ctrl.settings.title;
        ctrl.open = function () {
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
        };
        ctrl.close = function () {
            if (ctrl) {
                var f = $("#b" + ctrl.uniqueId);
                if (f) {
                    f.modal('hide');
                }
            }
        };
        ctrl.showErrors = function () {
            var id = site.guid();
            modalWindow.getInstance({
                control: {
                    errors: ctrl.model().errors,
                    title: "Ошибки",
                    close: function () {
                        var f = $("#b" + id);
                        if (f) {
                            f.modal('hide');
                        }
                    },
                    uniqueId: id,
                    modalWindowTemplate: '<div id="b' + id + '" class="modal fade" tabindex="-1" role="dialog">\
                            <div class="modal-dialog" role="document">\
                                <div class="modal-content">\
                                    <div id="h' + id + '" class="modal-header">\
                                    <button type="button" class="close" data-bind="click: close" aria-hidden="true">&times;</button>\
                                    <h4 class="modal-title" data-bind="text: title"></h4>\
                                </div>\
                                <div id="c' + id + '" class="modal-body">\
                                    <div class="margin-sm">\
                                        <ul data-bind="foreach: errors">\
                                            <li><span class="text-danger" data-bind="text: $data"></span></li>\
                                        </ul>\
                                    </div>\
                                </div>\
                                <div id="f' + id + '" class="modal-footer">\
                                    <button type="button" class="btn btn-default" data-bind="click: close">Закрыть</button>\
                                </div>\
                              </div>\
                            </div>\
                        </div>'},
                windowOptions: { keyboard: true, backdrop: "static" }
            });

        };
        ctrl.save = function () {
            let result = ctrl.getResult(ko.utils.unwrapObservable(ctrl));
            if (ctrl.settings.events.onSave) {
                ctrl.settings.events.onSave(result);
            }
        };
        ctrl.canSave = ko.computed(function () {
            if (ctrl.model && ctrl.model()) {
                return ctrl.model().canSave();
            }
            return false;
        });
        ctrl.cancel = function () {
            var item = ko.utils.unwrapObservable(ctrl.model());
            if (ctrl.canSave()) {
                dialog.getInstance({
                    title: "Подтверждение операции",
                    message: "Выйти из редактирования, не сохраненные данные буду утеряны?"
                }).showDialog().then(function (dialog) {
                    if (dialog.dialogResult) {
                        if (ctrl.model().isChanged()) ctrl.model().resetChanged();
                        if (ctrl.settings.onCancel) { ctrl.settings.onCancel(item); }
                        ctrl.close();
                    } else {
                        if (ctrl.settings.onCancel) {
                            ctrl.settings.onCancel(item);
                        }
                        return;
                    }
                });
            } else {
                if (ctrl.settings.onCancel) {
                    ctrl.settings.onCancel(item);
                }
                ctrl.close();
            }
        };
        ctrl.modalWindowTemplate = '<div id="b' + ctrl.uniqueId + '" class="modal fade" tabindex="-1" role="dialog">\
                            <div class="modal-dialog modal-lg" role="document" data-bind="indicate: indicator">\
                                <div class="modal-content">\
                                    <div id="h' + ctrl.uniqueId + '" class="modal-header">\
                                    <button type="button" class="close" data-bind="click: cancel" aria-hidden="true">&times;</button>\
                                    <h4 class="modal-title" data-bind="text: title"></h4>\
                                </div>\
                                <div id="c' + ctrl.uniqueId + '" class="modal-body"></div>\
                                <div id="f' + ctrl.uniqueId + '" class="modal-footer">\
                                    <span data-bind="visible: model().isChanged()" title=\"несохраненные данные\"><i class=\"fa fa-asterisk text-danger\"></i></span>\
                                    <button class="btn btn-danger" data-bind="visible: !model().isValidated(),click: showErrors, attr:{title: model().errors}"><i class=\"fa fa-exclamation-triangle\"></i>&nbsp;<span data-bind=\"text: model().errors().length\"></span></button>\
                                    <button type="button" class="btn btn-primary" data-bind="enable: canSave, click: save">сохранить</button>\
                                    <button type="button" class="btn btn-default" data-bind="click: cancel">отмена</button>\
                                    </div>\
                                </div>\
                            </div>\
                        </div>';
        return {
            open: ctrl.open,
            close: ctrl.close,
            model: ctrl.model,
            context: ctrl.context,
            getBody: ctrl.getBody,
            uniqueId: ctrl.uniqueId,
            isHidden: ctrl.isHidden,
            title: ctrl.settings.title,
            onOpened: ctrl.settings.events.onOpened,
            modalWindowTemplate: ctrl.modalWindowTemplate
        };

    }

    return {
        getInstance: function (options) {
            return new factory(options);
        }
    };

});