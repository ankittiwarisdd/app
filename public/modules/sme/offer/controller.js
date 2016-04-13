"use strict";
app.controller('OfferController', ['$scope','$rootScope', 'Upload', '$timeout', 'CategoryService', '$state', '$stateParams', '$location', 'SubCategoryService', 'MerchantService', '$localStorage', 'OfferService', 'OfferTypeService', 'ngTableParams', '$filter',  function($scope, $rootScope, Upload, $timeout, CategoryService, $state, $stateParams, $location, SubCategoryService, MerchantService, $localStorage, OfferService, OfferTypeService, ngTableParams, $filter){

	if($localStorage.userId){
		$scope.merchant = $localStorage.userId;
		var inputjson = "";
		inputjson = '{"merchant": "' + $localStorage.userId + '"}';
		//console.log($localStorage);console.log(inputjson);return false;
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


	OfferService.manageOffers ($localStorage.userId,function(response) {		
		if(response.messageId == 200) {
			$scope.filter = {name: ''};
			$scope.tableParams = new ngTableParams({page:1, count:10, sorting:{title:"asc"}, filter:$scope.filter}, { total:response.data.length, counts:[], data: response.data});
			
			//apply global Search
			$scope.applyGlobalSearch = function() {
				var term = $scope.globalSearchTerm;
				if(term != "") {
					if($scope.isInvertedSearch) {
						term = "!" + term;
					}
					$scope.tableParams.filter({$ : term});
					$scope.tableParams.reload();			
				}
			}

			//multiple checkboxes
			var simpleList = response.data;
			$scope.checkboxes = {
				checked: false,
				items:{}
			};

			// watch for check all checkbox
		    $scope.$watch(function() {
		      return $scope.checkboxes.checked;
		    }, function(value) {
		    	angular.forEach(simpleList, function(item) {
		       	$scope.checkboxes.items[item._id] = value;
		      });
		    });

			// watch for data checkboxes
		    $scope.$watch(function() {
		      return $scope.checkboxes.items;
		    }, function(values) {
				var checked = 0, unchecked = 0,
		        total = simpleList.length;
				angular.forEach(simpleList, function(item) {
					checked   +=  ($scope.checkboxes.items[item._id]) || 0;
					unchecked += (!$scope.checkboxes.items[item._id]) || 0;
				});
				if ((unchecked == 0) || (checked == 0)) {
					$scope.checkboxes.checked = (checked == total);
				}
		    var result = document.getElementsByClassName("select-all");
		    angular.element(result[0]).prop("indeterminate", (checked != 0 && unchecked != 0));
		    }, true);
		}
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
			        $state.go('manageOffer');
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


	if($stateParams.offerId){
		OfferService.editOffer($stateParams.offerId, function(response) {
			if(response.messageId == 200) {
				$scope.Offer = response.data;
				response.data.from = $filter('date')(response.data.from, "MM/dd/yyyy");
				response.data.to = $filter('date')(response.data.to, "MM/dd/yyyy");
				if(response.data.businessType == "physical"){
			      response.data.businessType = 1;
			    }else if(response.data.businessType == "ecom"){
			      response.data.businessType = 2;
			    }else{
			      response.data.businessType = 3;
			    } 
				$scope.Offer.datetimerange = response.data.from+" "+response.data.time_from+" - "+response.data.to+" "+response.data.time_to;
			}
		});
	}


	$scope.updateOffer = function() {
		$scope.Offer.merchant = $scope.merchant;
		$scope.Offer.subcategory = $scope.subcategory;
		$scope.Offer.latitude = $scope.latitude;
		$scope.Offer.longitude = $scope.longitude;
		var dateArray = $scope.Offer.datetimerange.split(" - ");
		$scope.Offer.from = dateArray[0];
		$scope.Offer.to = dateArray[1];
//console.log($scope.Offer);return false;
		if($scope.Offer.pic){
			/////////////////Uploading Pic Start///////////////
			var file = $scope.Offer.pic;
			file.upload = Upload.upload({
		      	url: '/offers/upload',
		      	data: {file: file},
		    });

		    file.upload.then(function (response) {
		   		$scope.Offer.image = response.data;
				if($scope.Offer.pic){
					delete $scope.Offer.pic;
				}
				OfferService.updateOffer($scope.Offer, function(response) {
				if(response.messageId == 200) {					
						$state.go('manageOffer');
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
	    	/////////////////Uploading Pic End///////////////
		}else{
			if($scope.Offer.pic){
				delete $scope.Offer.pic;
			}
			//console.log($scope.Offer);return false;
			OfferService.updateOffer($scope.Offer, function(response) {
			if(response.messageId == 200) {					
					$state.go('manageOffer');
				}
			});
		}		
	}


	$scope.deleteImageOffer = function (offerId,offerImg) {
      	var ask = confirm('Are you sure to delete this image');
      	var jsonString = "";
		if (ask) {
			jsonString = '{"offerId": "'+offerId+'", "image":"'+offerImg+'"}';
		    OfferService.deleteImageOffer(jsonString, function (response) {
		    	if (response.data.messageId == 200) {
					$state.go('manageOffer');
				}
			})
      	}
	}


	$scope.performAction = function() {		
		var result=confirm("Are you sure to proceed with the selected action?");
		if (result==0) {
			return false;
		}else{
			var data = $scope.checkboxes.items;	
			var records = [];
			var inputJsonString = "";
			var jsonString = "";

			var actionToPerform = "";
			
			$scope.selectAction = selectAction.value;
			if($scope.selectAction == "disable") {
				actionToPerform = false;
			}
			else if($scope.selectAction == "enable") {
				actionToPerform = true;
			}
			else if($scope.selectAction == "delete") {
				actionToPerform = "delete";
			}

			for(var id in data) {
				if(data[id]) {
					if(actionToPerform == "delete") {
						if(jsonString == "") {
							jsonString = '{"_id": "' + id + '", "is_deleted":"true"}';	
						}
						else {
							jsonString = jsonString + "," + '{"_id": "' + id + '", "is_deleted":"true"}';
						}
					}
					else {
						if(jsonString == "") {							
							jsonString = '{"_id": "' + id + '", "enable":"' + actionToPerform + '"}';	
						}
						else {
							jsonString = jsonString + "," + '{"_id": "' + id + '", "enable":"' + actionToPerform + '"}';
						}
					}
				}				
			}
			inputJsonString = "[" + jsonString + "]";
			if(actionToPerform == "delete") {
				OfferService.deleteOffer(inputJsonString, function(response) {
					if(response.messageId == 200){
						$location.path('/manageOffer/');
					}
				});
			}
			else {
				OfferService.statusOffer(inputJsonString, function(response) {
					if(response.messageId == 200){
						$location.path('/manageOffer/');
					}
				});
			}
		}
	}
}])