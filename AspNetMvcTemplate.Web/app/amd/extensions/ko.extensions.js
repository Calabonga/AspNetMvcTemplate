define(function (require) {
    const
        ko = require("knockout"),
        config = require("config"),
        moment = require("moment"),
        system = require("durandal/system"),
        site = require("engine/common/framework"),
        logger = require("engine/controls/logger");

    var init = function () {

        ko.observableArray.fn.find = function (prop, data) {
            var valueToMatch = data[prop];
            return ko.utils.arrayFirst(this(), function (item) {
                return item[prop] === valueToMatch;
            });
        };

        /* catch and precent cyclical references in rootObject */
        function toJSON(rootObject, replacer, spacer) {
            var cache = [];
            var plainJavaScriptObject = ko.toJS(rootObject);
            var replacerFunction = replacer || cycleReplacer;
            var output = ko.utils.stringifyJson(plainJavaScriptObject, replacerFunction, spacer || 2);
            cache = null;
            return output;

            function cycleReplacer(key, value) {
                if (typeof value === "object" && value !== null) {
                    if (cache.indexOf(value) !== -1) {
                        return; // cycle is found, skip it
                    }
                    cache.push(value);
                }
                return value;
            }
        }
        ko.bindingHandlers.columns = {
            init: function (element, valueAccessor, allBindingsAccessor) {
                const pagedList = valueAccessor();
                if (pagedList && pagedList.columns && pagedList.columns.length && pagedList.templateHeaderColumn) {
                    const container = document.createElement("thead");
                    ko.renderTemplate(pagedList.templateHeaderColumn, pagedList, { templateEngine: site.stringEngine().getInstance() }, container, null);
                    $(element).replaceWith(container);
                }
                return { controlsDescendantBindings: true };
            }
        };
        ko.bindingHandlers.dump = {
            init: function (element, valueAccessor, allBindingsAccessor, viewmodel, bindingContext) {
                var context = valueAccessor();
                var allBindings = allBindingsAccessor();
                var pre = document.createElement("pre");
                element.appendChild(pre);

                var dumpJSON = ko.computed({
                    read: function () {
                        var enable = allBindings.enable === undefined || allBindings.enable;
                        return enable ? toJSON(context, null, 2) : "";
                    },
                    disposeWhenNodeisRemoved: element
                });

                ko.applyBindingsToNode(pre, {
                    text: dumpJSON,
                    visible: dumpJSON
                });

                return { controlsDescendentBindings: true };
            }
        };
        ko.bindingHandlers.dblookup = {
            init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                "use strict";
                const dblookup = valueAccessor();
                if (dblookup) {
                    var container = document.createElement("div");
                    ko.renderTemplate(dblookup.fieldTemplate,
                        dblookup.selectorModel,
                        { templateEngine: site.stringEngine().getInstance() },
                        container,
                        null);
                    $(element).replaceWith(container);
                }
            }
        };
        ko.bindingHandlers.switcher = {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var options = allBindingsAccessor().switcherOptions;
                if (options) {
                    $(element).bootstrapToggle(options);
                } else {
                    $(element).bootstrapToggle();
                }
                var value = ko.utils.unwrapObservable(valueAccessor());
                var disabled = $(element).prop("disabled");
                $(element).bootstrapToggle("enable");
                $(element).bootstrapToggle(value ? "on" : "off");
                if (disabled) $(element).bootstrapToggle("disable");
                $(element).on("change", function () {
                    valueAccessor()($(this).prop("checked"));
                });
            },
            update: function (element, valueAccessor, allBindingsAccessor, viewModel) {
                var vStatus = $(element).prop("checked");
                var vmStatus = ko.utils.unwrapObservable(valueAccessor());
                if (vStatus !== vmStatus) {
                    var value = vmStatus;
                    var disabled = $(element).prop("disabled");
                    $(element).bootstrapToggle("enable");
                    $(element).bootstrapToggle(value ? "on" : "off");
                    if (disabled) $(element).bootstrapToggle("disable");
                }
            }
        };
        ko.bindingHandlers.hidden = {
            update: function (element, valueAccessor) {
                var value = ko.utils.unwrapObservable(valueAccessor());
                ko.bindingHandlers.visible.update(element, function () { return !value; });
            }
        };
        ko.bindingHandlers.indicate = {
            init: function (element, valueAccessor) {
                var value = valueAccessor(),
                    ctrl = ko.utils.unwrapObservable(value);
                $(element).css("min-height", "70px");
                ko.utils.domNodeDisposal.addDisposeCallback(element,
                    function () {
                        var el = $("#block" + ctrl.uniqueId)[0];
                        if (el) ko.removeNode(el);
                    });
            },
            update: function (element, valueAccessor) {
                var value = valueAccessor(),
                    ctrl = ko.utils.unwrapObservable(value);
                var el;
                if (ctrl.isbusy()) {
                    if (ctrl && ctrl.template) {
                        var block = ctrl.template(element);
                        $(element).append(block);
                    }
                } else {
                    el = $("#block" + ctrl.uniqueId)[0];
                    if (el) ko.removeNode(el);
                }
            }
        };
        ko.bindingHandlers.pagedList = {
            init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                var pagedList = valueAccessor();
                var pagedListContext = (allBindings && allBindings().context) || {};
                var container = document.createElement("div");
                pagedList.loadTemplate().fail(function (response) {
                    logger.error("PagedList binding cannot render items because: " + response, true);
                }).done(function (template) {
                    ko.renderTemplate(template,
                      { pagedList: pagedList, context: pagedListContext },
                      { templateEngine: site.stringEngine().getInstance() },
                      container, null);
                    $(element).html(container);
                });
                return { controlsDescendantBindings: true };
            }
        };
        ko.bindingHandlers.doubleClick = {
            init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                var handler = valueAccessor(),
                    delay = 300,
                    clickTimeout = false;

                $(element)
                    .click(function () {
                        if (clickTimeout !== false) {
                            handler.call(viewModel);
                            clickTimeout = false;
                        } else {
                            clickTimeout = setTimeout(function () {
                                clickTimeout = false;
                            },
                                delay);
                        }
                    });
            }
        };
        ko.bindingHandlers.dateTimePicker = {
            init: function (element, valueAccessor, allBindingsAccessor) {
                //initialize datepicker with some optional options
                var options = allBindingsAccessor().dateTimePickerOptions || {};
                options.locale = "ru";
                options.defaultDate = valueAccessor()();
                options.icons = {
                    time: "fa fa-clock-o",
                    date: "fa fa-calendar",
                    up: "fa fa-caret-up",
                    down: "fa fa-caret-down",
                    previous: "fa fa-chevron-left",
                    next: "fa fa-chevron-right",
                    today: "fa fa-calendar",
                    clear: "fa fa-trash",
                    close: "fa fa-times"
                }
                $(element).datetimepicker(options);

                //when a user changes the date, update the view model
                ko.utils.registerEventHandler(element, "dp.change", function (event) {
                    var value = valueAccessor();
                    if (ko.isObservable(value) && event.date) {
                        if (moment.isMoment(event.date) && !event.date.isUtc()) {
                            value(event.date.toISOString());
                        } else {
                            value(event.date);
                        }
                    } else {
                        value(null);
                        event.date = null;
                    }
                });

                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                    var picker = $(element).data("DateTimePicker");
                    if (picker) {
                        picker.destroy();
                    }
                });
            },
            update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
                var picker = $(element).data("DateTimePicker");
                if (picker) {
                    var date = valueAccessor()();
                    if (date) {
                        picker.date(date);
                    }
                }
            }
        };

        system.log("ENGINE: KO.bindingHandlers successfully initialized");

        /* More Validations
         * https://github.com/Knockout-Contrib/Knockout-Validation 
         */
        ko.validation.rules["minArrayLength"] = {
            validator: function (obj, params) {
                return obj.length >= params.minLength;
            },
            message: "Требуется минимум элементов в списке"
        };

        ko.validation.registerExtenders();

        system.log("ENGINE: KO.validation rules successfully added");

        ko.validation.init({
            registerExtenders: true, //default is true
            messagesOnModified: true, //default is true
            insertMessages: true, //default is true
            parseInputAttributes: false, //default is false
            writeInputAttributes: false, //default is false
            messageTemplate: null, //default is null
            decorateElement: false, //default is false. Applies the validationElement CSS class
            errorMessageClass: "text-danger"
        });
        
        
        system.log("ENGINE: KO.validation successfully initialized");
        ko.validation.localize({
            required: "Необходимо заполнить это поле.",
            min: "Значение должно быть больше или равно {0}.",
            max: "Значение должно быть меньше или равно {0}.",
            minLength: "Длина поля должна быть не меньше {0} символов.",
            maxLength: "Длина поля должна быть не больше {0} символов.",
            pattern: "Пожалуйста проверьте это поле.",
            step: "Значение поле должно изменяться с шагом {0}",
            email: "Введите в поле правильный адрес email",
            date: "Пожалуйста введите правильную дату",
            dateISO: "Пожалуйста введите правильную дату в формате ISO",
            number: "Поле должно содержать число",
            digit: "Поле должно содержать цифры",
            phoneUS: "Поле должно содержать правильный номер телефона",
            equal: "Значения должны быть равны",
            notEqual: "Пожалуйста выберите другое значение.",
            unique: "Значение должно быть уникальным."
        });
        system.log("ENGINE: KO.validation successfully localized");
    }
    return {
        init: init
    }

});