Site.Uploader = function () {

    "use strict";

    var
        create = function (options) {
            const
                dropElementId = options.dropElementId,
                cssHover = options.cssHover || "hover",
                onUploaded = options.onUploaded || null,
                requestData = options.requestData || null,
                uploadUrl = options.uploadUrl,
                maxFileSize = options.maxFileSize || 1048576,
                dropZone = $("#" + dropElementId),
                subscribe = function () {
                    if (dropZone) {
                        dropZone[0].ondragover = function () {
                            dropZone.addClass(cssHover);
                            return false;
                        };
                        dropZone[0].ondragleave = function () {
                            dropZone.removeClass(cssHover);
                            return false;
                        };
                        dropZone[0].ondrop = function (event) {
                            event.preventDefault();
                            dropZone.removeClass(cssHover);

                            const filesToTransfer = event.dataTransfer.files;
                            if (filesToTransfer.length > 0) {
                                var file, data = new FormData();
                                if (requestData && typeof requestData === "object") {
                                    for (var prop in requestData) {
                                        if (requestData.hasOwnProperty(prop)) {
                                            data.append(prop, requestData[prop]);
                                        }
                                    }
                                }
                                for (var i = 0; i < filesToTransfer.length; i++) {
                                    file = filesToTransfer[i];
                                    if (file.size > maxFileSize) {
                                        Site.msg.error("File " + file.name + " is too big! (" + file.size + " > " + maxFileSize);
                                        return false;
                                    } else {
                                        data.append(file.name, file);
                                    }
                                }

                                const xhr = new XMLHttpRequest();
                                xhr.upload.addEventListener("progress",
                                    function (event) {
                                        var percent = parseInt(event.loaded / event.total * 100);
                                        Site.msg.info(percent + "%");
                                    },
                                    false);
                                xhr.onreadystatechange = function (event) {
                                    if (event.target.readyState === 4) {
                                        if (event.target.status === 200) {
                                            Site.msg.success("Upload successfully complete!");
                                            if (onUploaded) {
                                                var response = JSON.parse(event.target.response);
                                                onUploaded(response);
                                            }
                                        } else {
                                            Site.msg.error("The error was occurred!");
                                        }
                                    }
                                };
                                xhr.open("POST", uploadUrl, true);
                                xhr.send(data);
                                return true;
                            }
                            return false;
                        };
                        Site.msg.info("DropZone for updloading successfully created");
                    } else {
                        Site.msg.error("DropZone creating fails");
                    }
                },
                createDropZone = function () {
                    if (!dropElementId) throw Error("The DOM element does not provided!");
                    if (!uploadUrl) throw Error("The UploadUrl does not provided!");
                    if (typeof (window.FileReader) === "undefined") {
                        Site.msg.error("Your browser does not support FileReader");
                    } else {
                        subscribe();
                    }
                };

            return {
                createDropZone: createDropZone
            };
        },
        factory = function (options) {
            return new create(options);
        };

    return {
        getInstance: function (options) {
            return new factory(options);
        }
    };
}();