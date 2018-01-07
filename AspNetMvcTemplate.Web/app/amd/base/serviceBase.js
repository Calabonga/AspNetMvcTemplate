 define(function (require) {
    const
        system = require("durandal/system"),
        http = require("engine/controls/http"),
        site = require("engine/common/framework"),
        serviceSettings = require("engine/controls/serviceSettings");

    var baseService = function () {
        this.serviceName = "ENGINE: service base name";
        this.settings = serviceSettings.getInstance();
        this.loader = http.getInstance();
        this.defaultMapper = null;
    };

    baseService.prototype = {
        activate: function () {
            if (this.options) {
                site.extend(this.settings, this.options);
            }
        },
        getPagedList: function (queryParams) {
            system.log("ENGINE: " + this.name + " getPagedList");
        },
        getAllList: function () {
            system.log("ENGINE: " + this.name + " getAllList");
        },
        getItemById: function () {
            system.log("ENGINE: " + this.name + " getItemById");
        },
        insertItem: function () {
            system.log("ENGINE: " + this.name + " insertItem");
        },
        updateItem: function () {
            system.log("ENGINE: " + this.name + " updateItem");
        },
        deleteItem: function () {
            system.log("ENGINE: " + this.name + " deleteItem");
        }
    }

    return baseService;

});