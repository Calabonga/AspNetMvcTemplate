define(function () {
    var create = function (result, options) {
        function PageItem(index, css, text) {
            var
                mode = function () {
                    if (css === "disabled") { return 1; }
                    if (css === "active") { return 2; }
                    return 0;
                }();

            return {
                pageIndex: index,
                css: css,
                text: text,
                mode: mode
            }
        }
        var visibleGroupCount = options.visibleGroupCount || 10,
                pagesUpdated = [],
                groupIndex = Math.floor((result.pageIndex - 1) / visibleGroupCount),
                minPage = groupIndex * visibleGroupCount + 1,
                prevPage = minPage - 1,
                maxPage = minPage + visibleGroupCount - 1,
                nextPage = maxPage + 1;

        if (maxPage > result.totalPages) {
            maxPage = result.totalPages; nextPage = 0;
        }

        pagesUpdated.push(new PageItem(minPage, minPage === 1 ? 'disabled' : '', '&laquo;&laquo;'));
        pagesUpdated.push(new PageItem(prevPage, prevPage === 0 ? 'disabled' : "", '&laquo;'));

        for (var i = minPage; i <= maxPage; i++) {
            pagesUpdated.push(new PageItem(
                i,
                result.pageIndex === i ? 'active' : '', i));
        }

        pagesUpdated.push(new PageItem(nextPage, nextPage === 0 ? "disabled" : "", "&raquo;"));
        pagesUpdated.push(new PageItem(maxPage, maxPage === result.totalPages ? "disabled" : "", '&raquo;&raquo;'));

        return pagesUpdated;
    },

    factory = function (results, options) {
        return new create(results, options);
    }

    return {
        getInstance: function (results, options) {
            return new factory(results, options);
        }
    };
});