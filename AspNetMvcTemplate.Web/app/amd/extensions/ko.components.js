define(function (require) {
    const
        ko = require("knockout"),
        system = require("durandal/system");

    //-----------------------------------
    // Additional information avaliable on the official site
    // http://knockoutjs.com/documentation/component-registration.html#specifying-a-viewmodel
    //-----------------------------------
    ko.components.register("datepicker", { require: "components/datepicker" });
    ko.components.register("date", { require: "components/date" });
    ko.components.register("flag", { require: "components/flag" });
    ko.components.register("switcher", { require: "components/switcher" });
    ko.components.register("status-selector", { require: "components/status-selector" });

    system.log("ENGINE: KO.components were successfully initialized");


});