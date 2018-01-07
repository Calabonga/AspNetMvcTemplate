Site.TemplateLoader = function() {

    var factory = function(options) {
        return new create(options);
    }

    var create = function(options) {

        var
            settings = {
                extension: ".html",
                folder: "templates"
            },
            loadedTemplates = [];

        Site.Extend(settings, options);

        var loadTemplate = function (template, callback) {
            var isObservable = ko.isObservable(template);
            var itemTemplate = isObservable ? template() : template;
            var t = settings;
            var def = $.Deferred();
            if (loadedTemplates.length && loadedTemplates[itemTemplate]) {
                var template = loadedTemplates[itemTemplate];
                if (callback) {
                    def.resolve(callback(template));
                } else {
                    def.resolve(template);
                }
            } else {
                if (t && itemTemplate) {
                    Site.Http(t.folder + "/" + itemTemplate + t.extension, null, {dataType: "html"})
                        .done(function(response) {
                             if (!loadedTemplates[itemTemplate]) {
                                loadedTemplates[itemTemplate]= response;
                            }
                             if (callback) {
                                 def.resolve(callback(response));
                             } else {
                                 def.resolve(response);
                             }
                        }).fail(function() {
                            Site.msg.error("TemplateLoader can not load template or service not avaliable.");
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

    return {
        getInstance: function(options) {
            return new factory(options);
        }
    }

}();