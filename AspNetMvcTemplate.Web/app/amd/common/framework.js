define(function (require) {
    const
        ko = require("knockout");
    var
        isFunction = function (functionToCheck) {
            var getType = {};
            return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
        },
        koStringTemplateEngine = function () {

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
                getInstance: function () {
                    return stringTemplateEngine;
                }
            }
        },
        extend = function (out) {
            out = out || {};
            for (var i = 1; i < arguments.length; i++) {
                var obj = arguments[i]; if (!obj) continue;
                for (var key in obj) {
                    if (obj.hasOwnProperty(key)) { if (typeof obj[key] === 'object') out[key] = extend(out[key], obj[key]); else out[key] = obj[key]; }
                }
            }
            return out;
        },
        guid = function () {
            return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        },
        inherit = function (parent) {
            //Crockford's approach adds the 'inherits' method
            //to all functions, as well as a per-class method
            //called 'uber' that allows you to make super calls.
            var d = 0, p = (this.prototype = new parent());

            this.prototype.uber = function (name) {
                var f, r, t = d, v = parent.prototype;
                if (t) {
                    while (t) {
                        v = v.constructor.prototype;
                        t -= 1;
                    }
                    f = v[name];
                } else {
                    f = p[name];
                    if (f === this[name]) {
                        f = v[name];
                    }
                }
                d += 1;
                r = f.apply(this, Array.prototype.slice.apply(arguments, [1]));
                d -= 1;
                return r;
            };
        },
        clone = function (obj) {
            if (obj === null || typeof (obj) !== 'object')
                return obj;
            var temp = new obj.constructor();
            for (var key in obj)
                temp[key] = clone(obj[key]);
            return temp;
        },
        getCookie = function (cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        },
        setCookie = function (name, value, expirydays) {
            var d = new Date();
            d.setTime(d.getTime() + (expirydays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = name + "=" + value + "; " + expires;
        },
        modelToPropertyList = function (model) {
            let props = [];
            let item = ko.toJS(model);
            for (let prop in item) {
                if (item.hasOwnProperty(prop)) {
                    props.push({ property: prop, value: item[prop] });
                }
            }
            return props;
        },
        blink = function (selector) {
            $(selector).fadeIn(400).fadeOut(200).fadeIn(400).fadeOut(200).fadeIn(400).fadeOut(200).fadeIn(400);
        };

    return {
        guid: guid,
        blink: blink,
        clone: clone,
        extend: extend,
        inherit: inherit,
        getCookie: getCookie,
        setCookie: setCookie,
        isFunction: isFunction,
        stringEngine: koStringTemplateEngine,
        modelToPropertyList: modelToPropertyList
    }
});