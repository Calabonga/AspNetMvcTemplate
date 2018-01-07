Site.FormEdit = function () {

    var factory = function (options) {
        return new create(options);
    }

    var create = function (options) {

        var ctrl = this;
        ctrl.context = {};
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
        ctrl.model = ko.observable();
        ctrl.uniqueId = Site.Guid();
        ctrl.settings = {
            okButtonText: "save",
            title: "Untitled",
            templateUrl: null,
            events: {
                onClosed: null,
                onOpened: null,
                onSave: null,
                onCancel: null
            },
            preloadedTemplates: null
        };
        Site.Extend(ctrl.settings, options);
        ctrl.title = ctrl.settings.title;
        ctrl.open = function () {
            return new Promise(function (resolve, reject) {
                if (ctrl.settings.events.onOpened) ctrl.settings.events.onOpened();
                Site.ModalWindow(ctrl, { keyboard: false, backdrop: 'static' }, ctrl.settings.events.onClosed, resolve);
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
        ctrl.save = function () {
            if (ctrl.settings.events.onSave) {
                var complete = function () {
                    if (ctrl.model && ctrl.model()) {
                        ctrl.model()().dirtyFlag().reset();
                    }
                    ctrl.dialogResult.dialogResult = true;
                    ctrl.close();
                };
                ctrl.settings.events.onSave(ko.utils.unwrapObservable(ctrl.getResult(ctrl)), complete);
            }
        };
        ctrl.canSave = ko.computed(function () {
            if (ctrl.model && ctrl.model()) {
                var dirty = ctrl.model()().dirtyFlag().isDirty();
                var valid = ctrl.model().isValid();
                return dirty && valid;
            }
            return false;
        });
        ctrl.cancel = function () {
            if (ctrl.canSave()) {
                if (confirm("Выйти из редактирования, не сохраненные данные буду утеряны?")) {
                    if (ctrl.model()().dirtyFlag().isDirty())
                        ctrl.model()().dirtyFlag().reset();
                    var item = ko.utils.unwrapObservable(ctrl.model());
                    if (ctrl.settings.onCancel) {
                        ctrl.settings.onCancel(item);
                    }
                } else {
                    return;
                }
            } else {
                if (ctrl.settings.onCancel) {
                    ctrl.settings.onCancel();
                }
            }
        };
        ctrl.modalWindowTemplate = '<div id="b' + ctrl.uniqueId + '" class="modal fade" tabindex="-1" role="dialog">\
                            <div class="modal-dialog" role="document">\
                                <div class="modal-content">\
                                    <div id="h' + ctrl.uniqueId + '" class="modal-header">\
                                    <button type="button" class="close" data-bind="click: close" aria-hidden="true">&times;</button>\
                                    <h4 class="modal-title" data-bind="text: title"></h4>\
                                    </div>\
                                    <div id="c' + ctrl.uniqueId + '" class="modal-body"></div>\
                                    <div id="f' + ctrl.uniqueId + '" class="modal-footer">\
                                    <span data-bind="visible: model()().dirtyFlag().isDirty()" title=\"есть несохраненные данные\"><i class=\"glyphicon glyphicon-asterisk text-danger\"></i></span>\
                                    <button type="button" class="btn btn-primary" data-bind="enable: canSave, click: save, text:settings.okButtonText"></button>\
                                    <button type="button" class="btn btn-default" data-bind="click: close">отмена</button>\
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

}();