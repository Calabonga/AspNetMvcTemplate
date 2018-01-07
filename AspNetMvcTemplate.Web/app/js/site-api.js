Site.api.Poll = function () {

    "use strict";
    var
        factory = function (options) {
            return new create(options);
        },
        Poll = function (options, callback) {
            var me = {}, data = options || {};
            me.fileName = data.fileName;
            me.voteCallback = callback || function () {
                alert("Vote!");
            }
            me.totalVotes = data.TotalVotes;
            me.question = data.Question;
            if (data.Answers) {
                me.answers = ko.utils.arrayMap(data.Answers,
                    function (item) {
                        return new Answer(item);
                    });
            }
            me.userAnswer = [];
            me.isVoted = ko.observable(false);
            me.select = function (item) {
                me.userAnswer = ko.unwrap(item);
                me.voteCallback(me.userAnswer);
            }
            return me;
        },
        Answer = function (options) {
            var data = options || {};
            this.answer = data.Answer;
            this.total = ko.observable(data.Total || 0);
            this.percent = ko.observable(data.Percent || 0);

        },
        create = function (options) {
            var
                settings = Site.ServiceSettings.getInstance(),
                url = "/api/";

            if (options) {
                Site.Extend(settings, options);
            }

            var
                getFromApiService = function () {
                    return Site.HttpGetJSON(url + "poll");
                },
                vote = function (data) {
                    return Site.HttpPostJSON(url + "vote", JSON.stringify(data));
                };

            return {
                // Service should return default methods for using Site.PagedList
                getAllList: null,
                getPagedList: null,
                getItemById: null,
                insertItem: null,
                updateItem: null,
                deleteItem: null,

                defaultMapper: Poll,

                getFromApiService: getFromApiService,
                vote: vote
            };
        };
    return {
        getInstance: function (options) {
            return new factory(options);
        }
    };
}();
Site.api.Pictures = function () {
    "use strict";

    var
        factory = function (options) {
            return new create(options);
        },
        Picture = function (dto) {
            var data = dto || {};
            this.createdAt = data.createdAt;
            this.name = data.name;
            this.directoryName = data.directoryName;
            this.length = data.length;
            this.fullName = data.fullName;
            this.url = data.url;
            this.selected = ko.observable(false);
        },
        create = function (options) {

            var
                settings = Site.ServiceSettings.getInstance(),
                url = "/api/images/";

            if (options) {
                Site.Extend(settings, options);
            }

            var
                getItemById = function (postId) {
                    return Site.HttpGetJSON(url + "get?guid=" + postId);
                },
                deleteItem = function (data) {
                    return Site.HttpPostJSON(url + "delete", JSON.stringify(data));
                };

            return {
                // Service should return default methods for using Site.PagedList
                getAllList: null,
                getPagedList: null,
                getItemById: getItemById,
                insertItem: null,
                updateItem: null,
                deleteItem: deleteItem,
                defaultMapper: Picture
            };

        };

    return {
        getInstance: function (options) {
            return new factory(options);
        }
    };
}();
Site.api.Tags = function () {
    "use strict";

    var
        factory = function (options) {
            return new create(options);
        },
        Tag = function (dto) {
            var data = dto || {};
            this.id = data.id;
            this.name = ko.observable(data.name);
            this.selected = ko.observable(false);
        },
        create = function (options) {

            var
                settings = Site.ServiceSettings.getInstance(),
                url = "/api/tags/";

            if (options) {
                Site.Extend(settings, options);
            }

            var
                getPagedList = function (params) {
                    var data = { qp: ko.toJSON(params) };
                    return Site.HttpGetJSON(url + "paged", data);
                },
                getTagsByNames = function (tags) {
                    return Site.HttpGetJSON(url + "getbyname?tags=" + tags);
                };

            return {
                // Service should return default methods for using Site.PagedList
                getAllList: null,
                getPagedList: getPagedList,
                getItemById: null,
                insertItem: null,
                updateItem: null,
                deleteItem: null,
                defaultMapper: Tag,

                // Other methods should be here
                getTagsByNames: getTagsByNames
            };

        };

    return {
        getInstance: function (options) {
            return new factory(options);
        }
    };
}();
Site.api.Utils = function () {

    "use strict";

    var
        factory = function (options) {
            return new create(options);
        },
        create = function (options) {

            var
                settings = Site.ServiceSettings.getInstance(),
                url = "/api/";

            if (options) {
                Site.Extend(settings, options);
            }

            var
                transform = function (title) {
                    var data = { value: title, spaceReplace: "dash" };
                    return Site.HttpPostJSON(url + "transform", JSON.stringify(data));
                },
                savePost = function (data) {
                    return Site.HttpPostJSON(url + "save", JSON.stringify(data), "application/x-www-form-urlencoded");
                };

            return {
                // Service should return default methods for using Site.PagedList
                getAllList: null,
                getPagedList: null,
                getItemById: null,
                insertItem: null,
                updateItem: null,
                deleteItem: null,

                // Other methods should be here
                transform: transform,
                savePost: savePost
            };

        };

    return {
        getInstance: function (options) {
            return new factory(options);
        }
    };

}();