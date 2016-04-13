"use strict";
app.controller('OfferController', ['$scope','$rootScope', 'Upload', '$timeout', 'CategoryService', '$state', '$stateParams', '$location', 'SubCategoryService', 'MerchantService', '$localStorage', 'OfferService', 'OfferTypeService',  function($scope, $rootScope, Upload, $timeout, CategoryService, $state, $stateParams, $location, SubCategoryService, MerchantService, $localStorage, OfferService, OfferTypeService){

	if($localStorage.userId){
		$scope.merchant = $localStorage.userId;
		var inputjson = "";
		inputjson = '{"merchant": "' + $localStorage.userId + '"}';
		MerchantService.findSubCategory(inputjson, function(response) {
			$scope.subcategory = response.data.subcategory[0];
		});
		MerchantService.findLatLong($scope.merchant, function(response) {
			$scope.latitude = response.data.latitude;
			$scope.longitude = response.data.longitude;
		});
	}

	OfferTypeService.manage(function(response) {
		//console.log("HERE I'M");console.log(response);return false;
		var data = response.data;
		var offertypeArr = [];
		for(var id in data) {
			var obj = {id:data[id]._id, name:data[id].name};
			offertypeArr.push(obj);
		}
		$scope.offertypes = offertypeArr;
	});
	
	$scope.addOffer = function() {
		$scope.Offer.merchant = $scope.merchant;
		$scope.Offer.subcategory = $scope.subcategory;
		$scope.Offer.latitude = $scope.latitude;
		$scope.Offer.longitude = $scope.longitude;
		var dateArray = $scope.Offer.datetimerange.split(" - ");
		$scope.Offer.from = dateArray[0];
		$scope.Offer.to = dateArray[1];
		//console.log($scope.Offer);
		//return false;
		var file = $scope.picFile;
		file.upload = Upload.upload({
	      	url: '/offers/upload',
	      	data: {file: file},
	    });

	    file.upload.then(function (response) {
	   		$scope.Offer.image = response.data;
			OfferService.saveOffer($scope.Offer, function(response) {
			if(response.messageId == 200) {	
			        $state.go('front.listOffers');
				}
			 });
			$timeout(function () {
				file.result = response.data;
			});
	    }, function (response) {
	      	if (response.status > 0)
	        $scope.errorMsg = response.status + ': ' + response.data;
	    }, function (evt) {
	      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
	    });
	};
	$scope.cancel = function() {
		$state.go($state.current, {}, {reload: true});
	}
	
}])