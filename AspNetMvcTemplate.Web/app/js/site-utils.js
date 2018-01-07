Site.IsFunction = function (functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
};
Site.StringEngine = function () {

    var StringTemplate = function (key, template) {
        if (arguments.length === 1) {
            this.template = key;
        } else {
            this.templateName = key;
            this.template = template;
        }
    };
    var stringTemplateEngine = new ko.nativeTemplateEngine();
    StringTemplate.prototype.text = function () {
        return this.template;
    };
    stringTemplateEngine.makeTemplateSource = function (templateName) {
        return new StringTemplate(templateName);
    };

    return {
        stringEngine: stringTemplateEngine
    };
}();
Site.Extend = function (out) {
    out = out || {};
    for (var i = 1; i < arguments.length; i++) {
        var obj = arguments[i]; if (!obj) continue;
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) { if (typeof obj[key] === 'object') out[key] = Site.Extend(out[key], obj[key]); else out[key] = obj[key]; }
        }
    }
    return out;
};
Site.Guid = function () {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
Site.ModalWindow = function (control, options, afterDialogClose, deferred) {

    var hasTemplateUrl = control.settings && control.settings.templateUrl;
    if (hasTemplateUrl) {
        Site.TemplateLoader
            .getInstance({ folder: "/templates" })
            .loadTemplate(control.settings.templateUrl)
            .then(function (loaded) {
                if (loaded) {
                    control.modalWindowContentTemplate = loaded;
                    var container = document.createElement("div");
                    container.setAttribute("id", "modal_" + control.uniqueId);
                    container.innerHTML = control.modalWindowTemplate;
                    $("#c" + control.uniqueId, container).append(control.modalWindowContentTemplate);
                    ko.renderTemplate(container.innerHTML,
                        control,
                        { templateEngine: Site.StringEngine.stringEngine },
                        container);
                    $("body").append(container);
                    $('#b' + control.uniqueId).modal(options).on('hidden.bs.modal',
                        function () {
                            if (afterDialogClose) afterDialogClose(control);
                            if (deferred) {
                                deferred(control.getResult(control));
                            }
                            $("#modal_" + control.uniqueId).remove();
                        });
                }
            }).fail(function (e) {
                Site.msg.error("Site.ModalWindow can't load template for control \"" + control.title + "\": " + e);
                if (afterDialogClose) afterDialogClose();
            });
    } else {
        var container = document.createElement("div");
        container.setAttribute("id", "modal_" + control.uniqueId);
        container.innerHTML = control.modalWindowTemplate;

        $("#c" + control.uniqueId, container).append(control.modalWindowContentTemplate);

        ko.renderTemplate(container.innerHTML, control, { templateEngine: Site.StringEngine.stringEngine }, container);
        $("body").append(container);
        $('#b' + control.uniqueId).modal(options).on('hidden.bs.modal',
            function () {
                if (afterDialogClose) afterDialogClose(control);
                if (deferred) {
                    deferred(control.getResult(control));
                }
                $("#modal_" + control.uniqueId).remove();
            });
    }
};
Site.Blink = function (selector) {
    $(selector).fadeIn(400).fadeOut(200).fadeIn(400).fadeOut(200).fadeIn(400).fadeOut(200).fadeIn(400);
};