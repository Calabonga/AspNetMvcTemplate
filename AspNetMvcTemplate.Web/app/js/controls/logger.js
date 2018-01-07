Site.Logger = function () {

    var
        log = function (type, message, showOnDashboard) {
            var data = { logType: type, message: message, sendToDashboard: showOnDashboard };
            Site.HttpPostJSON(Site.cfg.loggerUrl, JSON.stringify(data)).fail(function () {
                Site.msg.error("Error saving log to database", "error");
            });
        },
        logInfo = function (message, showPopup, options, showOnDashboard) {
            log("info", message, showOnDashboard||false);
            if (showPopup) {
                Site.msg["info"](message, options);
            }
        },
        logSuccess = function (message, showPopup, options, showOnDashboard) {
            log("success", message, showOnDashboard || false);
            if (showPopup) {
                Site.msg["success"](message, options);
            }
        },
        logWarning = function (message, showPopup, options, showOnDashboard) {
            log("warning", message, showOnDashboard || false);
            if (showPopup) {
                Site.msg["warning"](message, options);
            }
        },
        logError = function (message, showPopup, options, showOnDashboard) {
            log("error", message, showOnDashboard || false);
            if (showPopup) {
                Site.msg["error"](message, options);
            }
        };

    return {
        info: logInfo,
        success: logSuccess,
        warning: logWarning,
        error: logError
    }

}();