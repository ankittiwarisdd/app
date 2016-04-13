(function(){
    angular.module('ngLoadingSpinner', ['angularSpinner'])
    .directive('usSpinner',   ['$http', '$rootScope' ,function ($http, $rootScope){
        return {
            link: function (scope, elm, attrs)
            {
                $rootScope.spinnerActive = false;
                scope.isLoading = function () {
                    return $http.pendingRequests.length > 0;
                };

                scope.$watch(scope.isLoading, function (loading)
                {
                    $rootScope.spinnerActive = loading;
                    if(loading){
                        elm.removeClass('ng-hide');
                    }else{
                        
                      /*  setTimeout(function(){
                            $(".portfolioslider").colorbox({
                                    rel:'portfolioslider', 
                                    slideshow:false,
                                    innerWidth:640, innerHeight:390
                            });
                        },1000)*/
                  
                        
                        elm.addClass('ng-hide');
                    }
                });
            }
        };

    }]);
}).call(this);