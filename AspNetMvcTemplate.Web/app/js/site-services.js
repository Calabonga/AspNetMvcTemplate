Site.services.PictireService = function () {
    var
        create = function (options) {
            var
                postId = null,
                pictureService = Site.api.Pictures.getInstance(),
                uploaderOptions = {
                    dropElementId: "dropZone",
                    messageElementId: null,
                    uploadUrl: "/api/images/upload",
                    onUploaded: options.onUploadComplete
                },
                createUploader = function (value) {
                    postId = value;
                    if (postId) {
                        uploaderOptions.requestData = { "guid": postId };
                        const uploader = Site.Uploader.getInstance(uploaderOptions);
                        uploader.createDropZone();
                    } else {
                        throw new Error("PostId has not been provided!");
                    }
                },
                deletePicture = function (item) {
                    return pictureService.deleteItem(item);
                },
                loadPictures = function () {
                    return new Promise(function (resolve, reject) {

                        if (postId) {
                            pictureService.getItemById(postId).then(function (response) {
                                if (response && response.result) {
                                    var build = Site.OperationResult.build(response, pictureService.defaultMapper, false);
                                    if (build) {
                                        resolve(build.result);
                                    }
                                } else {
                                    reject();
                                }
                            });
                        }
                    });
                };

            return {
                loadPictures: loadPictures,
                deletePicture: deletePicture,
                createUploader: createUploader
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
Site.services.StateService = function () {
    var
        create = function (options) {
            var
                isPublished = ko.observable(options.IsPublished),
                isCommentView = ko.observable(options.CanViewComment),
                isCommentAdd = ko.observable(options.CanAddComment),
                updateHiddenControls = function () {
                    var published = isPublished();
                    var commentView = isCommentView();
                    var commentAdd = isCommentAdd();
                    $("#IsPublished").val(published);
                    $("#CanViewComment").val(commentView);
                    $("#CanAddComment").val(commentAdd);

                    if (published && published === "true") {
                        $("#published").closest(".btn").removeClass("btn-default").addClass("btn-success");
                        $("#draft").closest(".btn").removeClass("btn-danger").addClass("btn-default");
                    } else {
                        $("#published").closest(".btn").removeClass("btn-success").addClass("btn-default");
                        $("#draft").closest(".btn").removeClass("btn-default").addClass("btn-danger");
                    }

                    if (commentView && commentView === "true") {
                        $("#commentViewOn").closest(".btn").removeClass("btn-default").addClass("btn-success");
                    } else {
                        $("#commentViewOn").closest(".btn").removeClass("btn-success").addClass("btn-default");
                    }
                    if (commentAdd && commentAdd === "true") {
                        $("#commentAddOn").closest(".btn").removeClass("btn-default").addClass("btn-success");
                    } else {
                        $("#commentAddOn").closest(".btn").removeClass("btn-success").addClass("btn-default");
                    }
                };

            isPublished.subscribe(function (value) {
                if (!value || value === "false") {
                    isCommentAdd("false");
                    isCommentView("false");
                    $("#commentAddOff").closest(".btn").button("toggle");
                    $("#commentViewOff").closest(".btn").button("toggle");
                }
                updateHiddenControls();
            });
            isCommentView.subscribe(function (value) {
                if (!value || value === "false") {
                    isCommentAdd("false");
                    $("#commentAddOff").closest(".btn").button("toggle");
                } else {
                    isPublished("true");
                }
                updateHiddenControls();
            });
            isCommentAdd.subscribe(function (value) {
                if (value && value === "true") {
                    isCommentView("true");
                    isPublished("true");
                    $("#published").closest(".btn").button("toggle");
                    $("#commentViewOn").closest(".btn").button("toggle");
                }
                updateHiddenControls();
            });
            updateHiddenControls();
            return {
                isPublished: isPublished,
                isCommentView: isCommentView,
                isCommentAdd: isCommentAdd
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
Site.services.TagService = function () {
    var
        create = function (options) {
            var
                parseTags = function (options) {
                    if (options) {

                        var items = options.split(';');
                        var result = [];
                        if (items && items.length) {
                            for (var i = 0; i < items.length; i++) {
                                result.push(items[i]);
                            }
                        }
                        return result;
                    }
                    return null;
                },
                tags = ko.observableArray(parseTags(options));
            return {
                tags: tags
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
Site.services.Transformer = function () {
    var
        service = Site.api.Utils.getInstance(),
        transform = function (value) {
            return new Promise(function (resolve, reject) {
                if (value) {
                    service.transform(value).then(function (response) {
                        resolve(response.result);
                    });
                } else {
                    reject();
                }
            });
        },
        create = function (options) {
            var me = this;
            me.isSelected = ko.observable(false);
            me.indicator = Site.BusyIndicator.getInstance();
            me.title = ko.observable(options.title);
            me.url = ko.observable(options.url);
            me.getUrl = function () {
                if (!me.title()) return;
                me.indicator.show();
                transform(me.title()).then(function (response) {
                    me.indicator.hide();
                    me.url(response.toLowerCase());
                });
            };

            me.isSelected.subscribe(function (value) {
                if (value && !me.url()) {
                    me.getUrl();
                }
            });

            return me;
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
Site.services.PollService = function () {
    var
        create = function (options) {
            var
                pollService = Site.api.Poll.getInstance(),
                getActive = function () {
                    return pollService.getFromApiService();
                },
                votePoll = function (answer) {
                    var data = ko.unwrap(answer);
                    return pollService.vote(data);
                };

            return {
                getActive: getActive,
                votePoll: votePoll,
                mapper: pollService.defaultMapper
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