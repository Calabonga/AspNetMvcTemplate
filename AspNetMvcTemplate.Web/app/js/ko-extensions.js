function toJSON(rootObject, replacer, spacer) {
    var cache = [];
    var plainJavaScriptObject = ko.toJS(rootObject);
    var replacerFunction = replacer || cycleReplacer;
    var output = ko.utils.stringifyJson(plainJavaScriptObject, replacerFunction, spacer || 2);

    cache = null;
    return output;

    function cycleReplacer(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                return;
            }
            cache.push(value);
        }
    }
}

ko.bindingHandlers.radio = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = valueAccessor();
        var newValueAccessor = function () {
            return {
                change: function () {
                    value(element.value);
                }
            }
        };
        ko.bindingHandlers.event.init(element, newValueAccessor, allBindingsAccessor, viewModel, bindingContext);
    },
    update: function (element, valueAccessor) {
        if ($(element).val() === ko.unwrap(valueAccessor())) {
            $(element).closest(".btn").button("toggle");
        }
    }
}
ko.bindingHandlers.dblookup = {
    init: function (element, valueAccessor) {
        var dblookup = valueAccessor();
        if (dblookup) {
            var container = document.createElement("div");
            ko.renderTemplate(dblookup.fieldTemplate, dblookup.selectorModel, { templateEngine: Site.StringEngine.stringEngine }, container, null);
            $(element).replaceWith(container);
        }
    }
};
ko.bindingHandlers.checkbox = {
    init: function (element, valueAccessor) {
        var observable = valueAccessor();
        if (!ko.isWriteableObservable(observable)) {
            throw "You must pass an observable or writeable computed";
        }
        var $element = $(element);
        $element.on("click", function () {
            observable(!observable());
        });
        ko.computed({
            disposeWhenNodeIsRemoved: element,
            read: function () {
                $element.toggleClass("active", observable());
            }
        });
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
        $(element).css('min-height', '70px');
        ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
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
    init: function (element, valueAccessor, allBindings) {
        var pagedList = valueAccessor();
        var pagedListContext = (allBindings && allBindings().context) || {};
        var container = document.createElement("div");
        pagedList.loadTemplate().then(function (template) {
            ko.renderTemplate(
                template,
                { pagedList: pagedList, context: pagedListContext },
                { templateEngine: Site.StringEngine.stringEngine },
                container,
                null);
            $(element).html(container);
        });
        return { controlsDescendantBindings: true };
    }
};
ko.bindingHandlers.doubleClick = {
    init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
        var handler = valueAccessor(),
            delay = 300,
            clickTimeout = false;

        $(element).click(function () {
            if (clickTimeout !== false) {
                handler.call(viewModel);
                clickTimeout = false;
            } else {
                clickTimeout = setTimeout(function () {
                    clickTimeout = false;
                }, delay);
            }
        });
    }
};
ko.bindingHandlers.dump = {
    init: function (element, valueAccessor) {
        var context = valueAccessor();
        var pre = document.createElement('pre');
        element.appendChild(pre);

        var dumpJson = ko.computed({
            read: function () {
                return ko.toJSON(context, null, 2);
            },
            write: function () {

            },
            disposeWhenNodeIsRemoved: element
        });

        ko.applyBindingsToNode(pre, { text: dumpJson });
    }
};