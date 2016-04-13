  app.directive('validPasswordCd', function () {
    return {
        require: 'ngModel',
        link: function (scope, elm, attrs, ctrl) {
            ctrl.$parsers.unshift(function (viewValue, $scope) {
                var noMatch = viewValue != scope.regForm.npassword.$viewValue
                
                ctrl.$setValidity('noMatch', !noMatch)
               return (noMatch)?noMatch:viewValue;

            })
        }
    }
});