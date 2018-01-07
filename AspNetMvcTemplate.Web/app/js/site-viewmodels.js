Site.models.PollViewModel = function () {
    var
        poll = ko.observable(),
        voted = ko.observable(false),
        pollService = Site.services.PollService.getInstance(),
        vote = function (item) {
            pollService.votePoll(item).then(function (response) {
                var build = Site.OperationResult.build(response, pollService.defaultMapper, false);
                if (build) {
                    voted(response.metadata.dataObject.isVoted);
                    poll(build.result);
                    ko.applyBindings({ model: { poll: poll, vote: vote, isVoted: voted } },
                        document.getElementById("poll"));
                }
            });
        },
        load = function () {
            pollService.getActive()
                .done(function(response) {
                    if (response && response.result) {
                        var build = Site.OperationResult.build(response, pollService.defaultMapper, false);
                        if (build) {
                            voted(response.metadata.dataObject.isVoted);
                            poll(build.result);
                            ko.applyBindings({ model: { poll: poll, vote: vote, isVoted: voted } },
                                document.getElementById("poll"));
                        }
                    } else {
                        document.getElementById("poll").remove();
                    }
                });
        }
    return {
        vite: vote,
        poll: poll,
        load: load
    }
}();
Site.models.PostDetailViewModel = function () {
    var init = function () {
        SyntaxHighlighter.all();
    };
    return {
        init: init
    };
}();
Site.models.PostEditViewModel = function () {
    const
        autoSaver = function (options) {
            var
                timer,
                lastSaveUpdate = ko.observable(),
                saveService = Site.api.Utils.getInstance({}),
                autoSaveEnabled = ko.observable(options && options.isEnabled || false),
                autoSaveInterval = ko.observable(options && options.interval || 0),
                createData = function () {
                    for (var instanceName in CKEDITOR.instances) {
                        if (CKEDITOR.instances.hasOwnProperty(instanceName)) {
                            CKEDITOR.instances[instanceName].updateElement();
                        }
                    }
                    var data = {};
                    $("form").serializeArray().map(function (x) { data[x.name] = x.value; });
                    return data;
                },
                save = function () {
                    var data = createData();
                    if (data) {
                        saveService.savePost(data)
                            .done(function (response) {
                                if (response && response.postId) {
                                    var date = new Date(response.updateAt);
                                    var lastUpate = date.toLocaleDateString() + " " + date.toLocaleTimeString();
                                    lastSaveUpdate(lastUpate);
                                    Site.msg.success(response.postTitle + " successfully saved at " + lastUpate);
                                }
                            })
                            .fail(function () {
                                Site.msg.error("Cannon save post");
                            });
                    }
                },
                init = function () {
                    if (autoSaveEnabled && autoSaveEnabled() === true) {
                        timer = setInterval(save, autoSaveInterval() * 1000 * 60);
                    } else {
                        if (timer) {
                            clearInterval(timer);
                        }
                    }
                };

            autoSaveEnabled.subscribe(function (value) {
                autoSaveEnabled(!!value);
                init();
            });

            return {
                init: init,
                save: save,
                lastSaveUpdate: lastSaveUpdate,
                autoSaveEnabled: autoSaveEnabled,
                autoSaveInterval: autoSaveInterval
            }
        },
        onPicturesUploadComplete = function (response) {
            if (response && response.result) {
                if (response.result.length) {
                    for (var i = 0; i < response.result.length; i++) {
                        const picture = response.result[i],
                            isExists = ko.utils.arrayFirst(pictureManager.pictures(), function (item) {
                                return item.name === picture.name;
                            });
                        if (isExists === null) {
                            pictureManager.pictures.push(response.result[i]);
                        }
                    }
                }
            }
        },
        pictureService = Site.services.PictireService.getInstance({ onUploadComplete: onPicturesUploadComplete }),
        pictureManager = function () {
            var
                indicator = Site.BusyIndicator.getInstance(),
                pictures = ko.observableArray([]),
                deletePicture = function (item) {
                    if (confirm("Are you sure to delete " + item.name + "?")) {
                        pictureService.deletePicture(item).then(function () {
                            pictures.remove(item);
                            Site.msg.success("File successfully deleted");
                        }).catch(function () {
                            Site.msg.error("File delete error");
                        });
                    }
                },
                copyUrlToClipboard = function (item) {
                    var textArea = document.createElement("textarea");
                    textArea.style.position = 'fixed';
                    textArea.style.top = 0;
                    textArea.style.left = 0;
                    textArea.style.width = '2em';
                    textArea.style.height = '2em';
                    textArea.style.padding = 0;
                    textArea.style.border = 'none';
                    textArea.style.outline = 'none';
                    textArea.style.boxShadow = 'none';
                    textArea.style.background = 'transparent';
                    textArea.value = item.url;
                    document.body.appendChild(textArea);
                    textArea.select();

                    try {
                        var successful = document.execCommand('copy');
                        var msg = successful ? 'successful' : 'unsuccessful';
                        Site.msg.success('Copying text command was ' + msg);
                    } catch (err) {
                        Site.msg.error('Ooo-o-ops!, unable to copy');
                    }

                    document.body.removeChild(textArea);
                };

            return {
                pictures: pictures,
                indicator: indicator,
                deletePicture: deletePicture,
                copyUrlToClipboard: copyUrlToClipboard
            };
        }(),
        createEditor = function (element, mode) {
            if (element) {
                var editorTag = document.getElementById(element);
                if (editorTag === null) return;
                if (mode === "small") {
                    CKEDITOR.replace(editorTag, Site.cfg.editorToolBars.small);
                } else {
                    CKEDITOR.replace(editorTag, Site.cfg.editorToolBars.default);
                }
            }
        },
        createDropZone = function (postId) {
            pictureService.createUploader(postId);
            pictureService.loadPictures(postId)
                .then(function (pictures) {
                    if (pictures) {
                        pictureManager.pictures(pictures);
                    }
                })
                .catch(function () {
                    Site.msg.warning("No files found for this post");
                });
        },
        initTransformer = function (options) {
            const transformer = Site.services.Transformer.getInstance(options);
            return {
                transformer: transformer
            };
        },
        tagService = function (options) {
            $.validator.setDefaults({ ignore: null });
            return Site.services.TagService.getInstance(options);
        },
        stateService = function (options) {
            return Site.services.StateService.getInstance(options);
        };
    return {
        autoSaver: autoSaver,
        initState: stateService,
        createEditor: createEditor,
        initTagProcessor: tagService,
        createDropZone: createDropZone,
        pictiresManager: pictureManager,
        initTransformer: initTransformer
    };
}();
Site.models.PostAddViewModel = function () {
    const
        init = function () {
            return Site.services.Transformer.getInstance({ title: "", url: "" });
        };
    return {
        init: init
    };
}();