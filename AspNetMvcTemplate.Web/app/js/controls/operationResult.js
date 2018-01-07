Site.OperationResult = function () {

    "use strict";

    var
        me = {},
        options = {
            "info": {
                "progressBar": true,
                "hideDuration": "1000",
                "timeOut": "3000",
                "positionClass": "toast-bottom-right",
                "showMethod": "slideDown",
                "hideMethod": "slideUp"
            },
            "success": {
                "progressBar": true,
                "hideDuration": "1000",
                "timeOut": "1400",
                "positionClass": "toast-top-right",
                "showMethod": "slideDown",
                "hideMethod": "slideUp"
            },
            "warning": {
                "hideDuration": "1000",
                "timeOut": "5000",
                "positionClass": "toast-bottom-full-width",
                "showMethod": "slideDown",
                "hideMethod": "slideUp"
            },
            "error": {
                "progressBar": true,
                "timeOut": "0",
                "positionClass": "toast-bottom-full-width",
                "showMethod": "slideDown",
                "hideMethod": "slideUp"
            }
        },
        build = function (response, mapper, showPopup) {

            if (!response) {
                Site.msg.error(mapper, "No response from service", options["error"]);
                return me;
            }
            if (response.ok && response.result) {
                me.isPaged = response.result.hasOwnProperty("items");
                if (me.isPaged) {
                    me.isArray = true;
                    if (mapper) {
                        me.result = response.result.items.map(function (item) {
                            return new mapper(item);
                        });
                    } else {
                        me.result = new mapper(response.result);
                    }

                } else {

                    me.isArray = Array.isArray(response.result);
                    if (mapper)
                        if (!me.isArray) {
                            me.result = new mapper(response.result);
                        } else {
                            me.result = response.result.map(function (item) {
                                return new mapper(item);
                            });
                        }
                    else
                        me.result = response.result;
                }
            }

            if (response.metadata && showPopup) {
                var types = ["info", "warning", "success", "error"];
                for (var type in types) {
                    if (types.hasOwnProperty(type)) {
                        if (response.metadata[types[type]]) {
                            Site.msg[types[type]](response.metadata[types[type]], showPopup, options[types[type]]);
                        }
                    }
                }
            }
            return me;
        };

    return {
        build: build
    };
}();