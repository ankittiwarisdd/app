app.directive("ckEditor", ["$timeout", function($timeout) {
    return {
        require: '?ngModel',
        restrict: 'A',
        link: function ($scope, element, attr, ngModelCtrl) {
            var editor = CKEDITOR.replace(element[0]);

            editor.on("change", function() {
                $timeout(function() {
                    ngModelCtrl.$setViewValue(editor.getData());
                });
            });

            ngModelCtrl.$render = function (value) {
                editor.setData(ngModelCtrl.$modelValue);
            };
        }
    };
}]);