define(function (require) {
    const
        system = require("durandal/system"),
        config = require("config"),
        site = require("engine/common/framework"),
        http = require("engine/controls/http"),
        logger = require("engine/controls/logger"),
        ko = require("knockout");

    var create = function (options) {

        var
            settings = {
                extension: ".html",
                folder: config.templateFolderUrl || "templates"
            },
            loadedTemplates = [];

        site.extend(settings, options);

        var loadTemplate = function (template, callback) {
            const isObservable = ko.isObservable(template);
            var itemTemplate = isObservable ? template() : template;
            const t = settings;
            var def = $.Deferred();
            if (!template) def.reject("ENGINE: The template URL for TemplateLoader does not provided!");
            if (loadedTemplates[itemTemplate]) {
                var templateLoaded = loadedTemplates[itemTemplate];
                if (callback) {
                    def.resolve(callback(templateLoaded));
                } else {
                    def.resolve(templateLoaded);
                }
            } else {
                if (t && itemTemplate) {
                    http.getInstance().getHtml(t.folder + "/" + itemTemplate + t.extension, null)
                        .done(function (response) {
                            if (!loadedTemplates[itemTemplate]) {
                                loadedTemplates[itemTemplate] = response;
                            }
                            if (callback) {
                                def.resolve(callback(response));
                            } else {
                                def.resolve(response);
                            }
                        })
                        .fail(function () {
                            let message = "ENGINE: TemplateLoader cannot load template or service not avaliable.";
                            system.log(message);
                            logger.error(message);
                            def.reject();
                        });
                } else {
                    def.reject();
                }
            }
            return def;
        };

        return {
            loadTemplate: loadTemplate
        }
    }

    var factory = function (options) {
        return new create(options);
    }

    return {
        getInstance: function (options) {
            return new factory(options);
        }
    }

});