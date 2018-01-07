define(function (require) {
    const
        ko = require("knockout"),
        config = require("config"),
        site = require("engine/common/framework"),
        logger = require("engine/controls/logger"),
        templateLoaderBuilder = require("engine/controls/templateLoader");

    var
        openWindow = function (control, options) {
            var container = document.createElement("div");
            container.setAttribute("id", "modal_" + control.uniqueId);
            container.innerHTML = control.modalWindowTemplate;
            $("#c" + control.uniqueId, container).append(control.modalWindowContentTemplate);
            ko.renderTemplate(container.innerHTML, control, { templateEngine: site.stringEngine().getInstance() }, container);
            $("body").append(container);
            $('#b' + control.uniqueId).modal(options.windowOptions).on('hidden.bs.modal', function () {
                if (options && options.onClosed) options.onClosed(control.getResult(control));
                if (options && options.deffered) { options.deffered(control.getResult(control)); }
                $("#modal_" + control.uniqueId).remove();
            });
        },
        create = function (options) {
            if (!options)
                throw new Error("Some options for ModalWindow was not provided");

            var control = options.control,
                afterDialogClose = options.onClosed,
                deferred = options.deffered;
            var hasTemplateUrl = (control.settings && control.settings.templateUrl);
            if (hasTemplateUrl) {
                templateLoaderBuilder
                    .getInstance({ folder: options.templateFolder || config.templateFolderUrl || "/templates" })
                    .loadTemplate(control.settings.templateUrl)
                    .then(function (loaded) {
                        if (loaded) {
                            control.modalWindowContentTemplate = loaded;
                            openWindow(control, options);
                            //var container = document.createElement("div");
                            //container.setAttribute("id", "modal_" + control.uniqueId);
                            //container.innerHTML = control.modalWindowTemplate;
                            //$("#c" + control.uniqueId, container).append(control.modalWindowContentTemplate);
                            //ko.renderTemplate(container.innerHTML, control, { templateEngine: site.stringEngine().getInstance() }, container);
                            //$("body").append(container);
                            //$('#b' + control.uniqueId).modal(options.windowOptions).on('hidden.bs.modal',
                            //    function () {
                            //        if (afterDialogClose) afterDialogClose(control.getResult(control));
                            //        if (deferred) {
                            //            deferred(control.getResult(control));
                            //        }
                            //        $("#modal_" + control.uniqueId).remove();
                            //    });
                        }
                    }).fail(function (e) {
                        logger.error("Site.ModalWindow can't load template for control \"" + control.title + "\": " + e,
                            true);
                        if (afterDialogClose) afterDialogClose();
                    });
            } else {
                openWindow(control, options);
                //var container = document.createElement("div");
                //container.setAttribute("id", "modal_" + control.uniqueId);
                //container.innerHTML = control.modalWindowTemplate;
                //$("#c" + control.uniqueId, container).append(control.modalWindowContentTemplate);
                //ko.renderTemplate(container.innerHTML, control, { templateEngine: site.stringEngine().getInstance() }, container);
                //$("body").append(container);
                //$('#b' + control.uniqueId).modal(options.windowOptions).on('hidden.bs.modal',
                //    function () {
                //        if (afterDialogClose) afterDialogClose(control.getResult(control));
                //        if (deferred) {
                //            deferred(control.getResult(control));
                //        }
                //        $("#modal_" + control.uniqueId).remove();
                //    });
            };
        },
        factory = function (options) {
            return new create(options);
        };


    return {
        getInstance: function (options) {
            return new factory(options);
        }
    };
});