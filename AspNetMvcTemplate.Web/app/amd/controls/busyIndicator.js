define(["durandal/system", "engine/common/framework","knockout", "config"],
    function(system, site, ko, config) {
        
        function create() {

            var ctrl = this;
            ctrl.uniqueId = site.guid();
            ctrl.isbusy = ko.observable(false);
            ctrl.imageName = config.busyIndicatorImagePath || '/images/loader.gif';
            ctrl.modalCss = '<style type="text/css">' +
                '.modalBusy {' +
                'position:absolute;' +
                'z-index:9998;' +
                'margin-left:0;' +
                'margin-right:0;' +
                'top:0;' +
                'left:0;' +
                'height:100%;' +
                'width:100%;' +
                'background:rgba(200,200,200,.75)url("' + ctrl.imageName + '") 50% 50% no-repeat;}' +
                '</style>';
            ctrl.ctrlTemplate = function () {
                var modalDiv = '<div id="block' + ctrl.uniqueId + '" ' + 'class="modalBusy">&nbsp;</div>';

                return modalDiv;
            };
            ctrl.show = function () {
                ctrl.isbusy(true);
            };
            ctrl.hide = function () {
                ctrl.isbusy(false);
            };
            ctrl.init = function () {
                if (!window.hasModelBlocker) {
                    $("head").append(ctrl.modalCss);
                    window.hasModelBlocker = true;
                }
                return;
            }();

            return {
                template: ctrl.ctrlTemplate,
                imageName: ctrl.imageName,
                uniqueId: ctrl.uniqueId,
                isbusy: ctrl.isbusy,
                show: ctrl.show,
                hide: ctrl.hide
            };
        }

        var factory = function () {
            return new create();
        }

        return {
            getInstance: function () {
                return new factory();
            }
        }
    });