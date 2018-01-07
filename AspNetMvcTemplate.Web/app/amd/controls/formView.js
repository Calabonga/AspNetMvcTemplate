define(function (require) {
    const
        site = require("engine/common/framework"),
        modalWindow = require("engine/controls/modalWindow"),
        ko = require("knockout");

    var factory = function (options) {
        return new create(options);
    }

    var create = function (options) {

        var ctrl = this;
        ctrl.context = {};
        ctrl.dialogResult = {};
        ctrl.getResult = function (control) {
            return {
                model: control.model(),
                context: control.context,
                title: control.title,
                uniqueId: control.uniqueId,
                dialogResult: ctrl.dialogResult
            }
        };
        ctrl.model = ko.observable();
        ctrl.uniqueId = site.guid();
        ctrl.settings = {
            title: "Untitled",
            templateUrl: null,
            events: {
                onClosed: null,
                onOpened: null
            },
            preloadedTemplates: null
        };
        site.extend(ctrl.settings, options);
        ctrl.title = ctrl.settings.title;
        ctrl.open = function () {
            return new Promise(function (resolve, reject) {
                if (ctrl.settings.events.onOpened) ctrl.settings.events.onOpened();
                modalWindow.getInstance({
                    control: ctrl,
                    windowOptions: { keyboard: true, backdrop: "static" },
                    onClosed: ctrl.settings.events.onClosed,
                    deffered: resolve
                });
            });
        };
        ctrl.close = function () {
            if (ctrl) {
                ctrl.dialogResult.dialogResult = true;
                var f = $("#b" + ctrl.uniqueId);
                if (f) {
                    f.modal('hide');
                }
            }
        };
        ctrl.modalWindowTemplate =
            '<div id="b' + ctrl.uniqueId + '" class="modal fade" tabindex="-1" role="dialog">\
                <div class="modal-dialog" role="document">\
                    <div class="modal-content">\
                        <div id="h' + ctrl.uniqueId + '" class="modal-header">\
                        <button type="button" class="close" data-bind="click: close" aria-hidden="true">&times;</button>\
                        <h4 class="modal-title" data-bind="text: title"></h4>\
                        </div>\
                        <div id="c' + ctrl.uniqueId + '" class="modal-body"></div>\
                        <div id="f' + ctrl.uniqueId + '" class="modal-footer">\
                        <button type="button" class="btn btn-default" data-bind="click: close">Ok</button>\
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
            model: ctrl.model,
            close: ctrl.close,
            open: ctrl.open
        };

    }

    return {
        getInstance: function (options) {
            return new factory(options);
        }
    };

});