define(function (require) {
    const
        toastr = require("toastr"),
        config = require("config"),
        system = require("durandal/system"),
        http = require("engine/controls/http");

    toastr.options.positionClass = config.toastr.positionClass || "toast-bottom-left";
    toastr.options.extendedTimeOut = config.toastr.extendedTimeOut || 100;
    toastr.options.fadeIn = config.toastr.fadeIn || 300;
    toastr.options.fadeOut = config.toastr.fadeOut || 500;
    toastr.options.timeOut = config.toastr.timeOut || 1400;
    toastr.options.showEasing = config.toastr.showEasing || "swing";
    toastr.options.hideEasing = config.toastr.hideEasing || "swing";

    var activate = function () {
        system.log("Logger activated");
    }
    var
    log = function (type, message) {
        var data = { logType: type, message: message };
        http.getInstance({ type: "POST" }).postJSON(config.urls.events.create, JSON.stringify(data));
    },
    logInfo = function (message, showPopup) {
        log("info", message);
        if (showPopup) {
            toastr["info"](message,"info");
        }
    },
    logSuccess = function (message, showPopup) {
        log("success", message);
        if (showPopup) {
            toastr["success"](message, "success");
        }
    },
    logWarning = function (message, showPopup) {
        log("warning", message);
        if (showPopup) {
            toastr["warning"](message, "warning", {
                "closeButton": true,
                "timeOut": 6000
            });
        }
    },
    logError = function (message, showPopup) {
        log("error", message);
        if (showPopup) {
            toastr["error"](message, "error", {
                "closeButton": true,
                "timeOut": 0
            });
        }
    };

    return {
        info: logInfo,
        error: logError,
        activate: activate,
        success: logSuccess,
        warning: logWarning
    }
});