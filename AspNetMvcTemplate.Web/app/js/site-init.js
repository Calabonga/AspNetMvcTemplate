var Site = Site || {};
Site.cfg = Site.cfg || {};
Site.api = Site.api || {};
Site.services = Site.services || {};
Site.models = Site.models || {};

// pagedList
Site.cfg.pagedListSearchLabel = "Search";

// general
Site.cfg.defaultPageSize = 10;
Site.cfg.appVersionUrl = "/api/v1";
Site.cfg.tokenUrl = "/c-token";

// settings for site
Site.cfg.throttle = 400;
Site.cfg.busyIndicatorImagePath = "/images/loader.gif";

// knockout validation
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
if (window.moment) {
    moment.locale("ru");
}

// toastr
if (!window.toastr) {
    throw new Error("Toaster is not found!");
}
Site.msg = window.toastr;
if (Site.msg) {
    Site.msg.options.positionClass = "toast-bottom-left";
    Site.msg.options.extendedTimeOut = 100;
    Site.msg.options.fadeIn = 300;
    Site.msg.options.fadeOut = 500;
    Site.msg.options.timeOut = 1400;
    Site.msg.options.showEasing = "swing";
    Site.msg.options.hideEasing = "swing";
}

Site.cfg.editorToolBars = {
    default: {
        toolbarGroups: [
            { name: "clipboard", groups: ["clipboard", "undo"] },
            { name: "editing", groups: ["find", "selection", "spellchecker", "editing"] },
            { name: "links", groups: ["links"] },
            { name: "insert", groups: ["insert"] },
            { name: "forms", groups: ["forms"] },
            { name: "tools", groups: ["tools"] },
            { name: "document", groups: ["mode", "document", "doctools"] },
            { name: "others", groups: ["others"] },
            "/",
            { name: "basicstyles", groups: ["basicstyles", "cleanup"] },
            { name: "paragraph", groups: ["list", "indent", "blocks", "align", "bidi", "paragraph"] },
            { name: "styles", groups: ["styles"] },
            { name: "colors", groups: ["colors"] },
            { name: "about", groups: ["about"] }
        ],
        removeButtons : "Underline,Subscript,Superscript"
    },
    small: {
        toolbarGroups: [
            { name: "clipboard", groups: ["clipboard", "undo"] },
            { name: "editing", groups: ["find", "selection", "spellchecker", "editing"] },
            { name: "links", groups: ["links"] },
            { name: "insert", groups: ["insert"] },
            { name: "forms", groups: ["forms"] },
            { name: "tools", groups: ["tools"] },
            { name: "document", groups: ["mode", "document", "doctools"] },
            { name: "others", groups: ["others"] },
            { name: "basicstyles", groups: ["basicstyles", "cleanup"] },
            { name: "paragraph", groups: ["list", "indent", "blocks", "align", "bidi", "paragraph"] },
            { name: "styles", groups: ["styles"] },
            { name: "colors", groups: ["colors"] },
            { name: "about", groups: ["about"] }
        ],
        removeButtons: "Underline,Subscript,Superscript,Cut,Copy,Paste,PasteText,PasteFromWord,Undo,Redo,Scayt,Unlink,Anchor,Image,HorizontalRule,SpecialChar,base64image,RemoveFormat,NumberedList,Outdent,Indent,Blockquote,Styles,Format,About"
    }
}

$(function () {
    $('[data-toggle="tooltip"]').tooltip();
})