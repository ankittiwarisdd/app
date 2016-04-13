"use strict";
app.controller('HomeController', ['$scope', 'HomeService', '$state', '$stateParams', '$location', 'CategoryService','$window', 'SubCategoryService' ,  function($scope, HomeService, $state, $stateParams, $location, CategoryService, $window ,SubCategoryService){
$window.scrollTo(0, 0);
$scope.catData = [];
$scope.catData1 = [];
$scope.smeMessage = {};
		HomeService.home (function(response) {		
				//console.log(response);
			if(response.messageId == 200) {
				var j=0;
				for(var i=0; i<response.data.length; i++) {
					if(i<5) {
						$scope.catData[i] = response.data[i];
					} else {
                        $scope.catData1[j] = response.data[i];
                        j++;
					}
				}
			}
		});	
		$scope.sendMsg = function (){
			HomeService.sendMessage($scope.smeMessage,function(response) {
				if(response.messageId == 200){
					alert('Your email has been successfully sent !!!!');
				}
				$scope.smeMessage = {};
				
			})
		}
	$scope.cancel = function() {
		$state.go($state.current, {}, {reload: true});
	}
}]) 

"use strict";
app.controller('CategoryController', ['$scope', 'HomeService', '$state', '$stateParams', '$location', 'CategoryService', 'SubCategoryService','$window' ,  function($scope, HomeService, $state, $stateParams, $location, CategoryService, SubCategoryService, $window){
HomeService.getSubCat ($stateParams.id,function(response) {
	if(response.messageId == 200) {
HomeService.getOffer (response.data[0]._id, function(response) {
	if(response.messageId == 200) {
		$scope.offerData = response.data;
	    }
	 })
  $scope.subCatData = response.data;
    }
 })
$window.scrollTo(0, 0);

 $scope.getOffer = function(offerId) {
    	HomeService.getOffer (offerId, function(response) {
    		if(response.messageId == 200) {
 	    	$scope.offerData = response.data;
 	    }
	 })
  }
}]) 


"use strict";
app.controller('ServiceController', ['$scope', 'HomeService', '$state', '$stateParams', '$location', 'CategoryService','$window', 'SubCategoryService' ,  function($scope, HomeService, $state, $stateParams, $location, CategoryService, $window ,SubCategoryService){
$window.scrollTo(0, 0);

}]) 