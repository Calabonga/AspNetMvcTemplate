define(function (require) {
    const
      ko = require("knockout"),
      site = require("engine/common/framework");

    var factory = function (options) {
        return new create(options);
    }

    var create = function (options) {

        var data = options || {}, ctrl = this;
        ctrl.currentDirection = { image: ko.observable(), direction: ko.observable(data.sortDirection) };
        ctrl.settings = {
            css: data.css || "paged-list-column",
            sortAscendingImageCss: data.sortAscendingImageCss || "fa fa-sort-asc",
            sortDescendingImageCss: data.sortDescendingImageCss || "fa fa-sort-desc"
        };
        site.extend(ctrl.settings, data);
        ctrl.fieldName = data.fieldName;
        ctrl.displayName = data.displayName;
        ctrl.updateUI = function (direction) {
            if (direction === "ascending") {
                ctrl.currentDirection.image(ctrl.settings.sortAscendingImageCss);
            } else if (direction === "descending") {
                ctrl.currentDirection.image(ctrl.settings.sortDescendingImageCss);
            } else if (!direction) {
                ctrl.currentDirection.image(direction);
            }
        }
        ctrl.resetColumnSorting = function() {
            ctrl.updateUI(null);
            ctrl.currentDirection.direction(null);
        }
        ctrl.setSortDirection = function (direction) {
            if (direction) {
                ctrl.updateUI(direction);
                ctrl.currentDirection.direction(direction);
            }
        }

        if (data.sortDirection) {
            ctrl.updateUI(data.sortDirection);
        }

        return ctrl;

    }

    return {
        getInstance: function (options) {
            return new factory(options);
        }
    };

});