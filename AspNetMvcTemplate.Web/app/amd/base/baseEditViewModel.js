define(function (require) {
    var
        ko = require("knockout"),
        site = require("engine/common/framework");

    var EditViewModelBase = function (dirtyProperties) {
        this.errors = ko.validation.group(dirtyProperties, { deep: true, live: true });
        this._dirtyFlag = new ko.DirtyFlag(dirtyProperties);
    };

    EditViewModelBase.prototype = {
        isChanged: function () {
            return this._dirtyFlag().isDirty();
        },
        isValidated: function () {
            return this.errors().length === 0;
        },
        canSave: function () {
            return this.isChanged() & this.isValidated();
        },
        resetChanged: function () {
            this._dirtyFlag().reset();
        },
        toDto: function () {
            var dto = site.clone(this);
            delete dto.resetChanged;
            delete dto.isChanged;
            delete dto.isValidated;
            delete dto.canSave;
            delete dto.errors;
            delete dto._dirtyFlag;
            delete dto.errorsList;
            delete dto.toDto;
            delete dto.__moduleId__;
            delete dto.constructor;
            return ko.toJS(dto);
        }
    }
    return EditViewModelBase;
});