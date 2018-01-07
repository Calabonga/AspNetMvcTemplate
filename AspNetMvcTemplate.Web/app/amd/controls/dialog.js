define(function (require) {
    const
        ko = require("knockout"),
        system = require("durandal/system"),
        site = require("engine/common/framework"),
        modalWindow = require("engine/controls/modalWindow");

    var create = function (options) {

        var ctrl = this;
        ctrl.dialogResult = false;
        ctrl.getResult = function (control) {
            return {
                model: control.model(),
                context: control.context,
                title: control.title,
                uniqueId: control.uniqueId,
                dialogResult: ctrl.dialogResult
            }
        };
        ctrl.context = {};
        ctrl.model = ko.observable();
        ctrl.uniqueId = site.guid();
        ctrl.settings = {
            title: "Untitled",
            templateUrl: null,
            message: "Confirm?",
            events: {
                onClosed: null,
                onOpened: null
            }
        };
        site.extend(ctrl.settings, options);
        ctrl.title = ctrl.settings.title;
        ctrl.showDialog = function () {
            return new Promise(function (resolve, reject) {
                if (ctrl.settings.events.onOpened) ctrl.settings.events.onOpened();
                system.log("ENGINE: opening dialog with title " + ctrl.title);
                modalWindow.getInstance({
                    control: ctrl,
                    windowOptions: { keyboard: true, backdrop: "static" },
                    onClosed: ctrl.settings.events.onClosed,
                    deffered: resolve
                });
            });
        };
        ctrl.ok = function () {
            if (ctrl) {
                ctrl.dialogResult = true;
                var f = $("#b" + ctrl.uniqueId);
                if (f) {
                    f.modal('hide');
                }
            }
        };
        ctrl.close = function () {
            var def = $.Deferred();
            if (ctrl) {
                ctrl.dialogResult = false;
                var f = $("#b" + ctrl.uniqueId);
                if (f) {
                    def.resolve(ctrl);
                    f.modal('hide');
                } else {
                    def.reject(ctrl);
                }
            }
            return def;
        };
        ctrl.modalWindowTemplate =
            '<div id="b' + ctrl.uniqueId + '" class="modal fade" tabindex="-1" role="dialog">\
                <div class="modal-dialog" role="document">\
                    <div class="modal-content">\
                        <div id="h' + ctrl.uniqueId + '" class="modal-header">\
                        <button type="button" class="close" data-bind="click: close" aria-hidden="true">&times;</button>\
                        <h4 class="modal-title" data-bind="text: title"></h4>\
                        </div>\
                        <div id="c' + ctrl.uniqueId + '" class="modal-body" data-bind=\"html: settings.message\"></div>\
                        <div id="f' + ctrl.uniqueId + '" class="modal-footer">\
                        <button type="button" class="btn btn-primary" data-bind="click: ok">Да</button>\
                        <button type="button" class="btn btn-default" data-bind="click: close">Нет</button>\
                        </div>\
                    </div>\
                </div>\
            </div>';
        return {
            onOpened: ctrl.settings.events.onOpened,
            title: ctrl.settings.title,
            isHidden: ctrl.isHidden,
            modalWindowTemplate: ctrl.modalWindowTemplate,
            uniqueId: ctrl.uniqueId,
            getBody: ctrl.getBody,
            context: ctrl.context,
            model: ko.observable(ctrl.settings.message),
            close: ctrl.close,
            showDialog: ctrl.showDialog
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
});
