"use strict";
app.controller('MerchantController', ['$scope', 'Upload', '$timeout', 'CategoryService', '$state', 'ngTableParams', '$stateParams', '$location', 'SubCategoryService', 'MerchantService',  function($scope, Upload, $timeout, CategoryService, $state, ngTableParams, $stateParams, $location, SubCategoryService, MerchantService){

		CategoryService.manage(function(response) {
			var data = response.data;
			var newCatArr = [];
			for(var id in data) {
				var obj = {id:data[id]._id, name:data[id].name};
				newCatArr.push(obj);
			}
			$scope.categories = newCatArr;
		});

		$scope.fetchSubCategories = function(item, cb) {
				SubCategoryService.fetchSubCategories(item,function(response) {
				var data = response.data;
				var newProArr = [];
				for(var id in data) {
					var obj = {id:data[id]._id, name:data[id].name};
					newProArr.push(obj);
				}
				$scope.subcategories = newProArr;
			});
		};


		$scope.fetchStates = function(country, cb) {
				MerchantService.getCountry(country,function(response) {
				var data = response.data;
				$scope.states = response.states;
			});
		};


		MerchantService.manageMerchant (function(response) {		
			if(response.messageId == 200) {
				$scope.filter = {tradingName: '', email: '', username: ''};
				$scope.tableParams = new ngTableParams({page:1, count:10, sorting:{tradingName:"asc"}, filter:$scope.filter}, { total:response.data.length, counts:[], data: response.data});
				
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
	//}


	$scope.addMerchant = function() {
		//console.log($scope.Merchant);console.log($scope.picFile);return false;
		var file = $scope.picFile;
		file.upload = Upload.upload({
	      	url: '/merchants/upload',
	      	data: {file: file},
	    });

	    file.upload.then(function (response) {
	   		$scope.Merchant.image = response.data; 
	   		if($scope.Merchant.password==$scope.Merchant.confirmpassword) {
			MerchantService.saveMerchant($scope.Merchant, function(response) {
				//console.log(response);return false;
			if(response.messageId == 200) {	
				$scope.msgerr = '';
			        $state.go('manageMerchant');
				}else {
						$scope.msgerr = response.message;
					}
			 });
		} else {
			    $scope.Merchant.password ='';
				$scope.Merchant.confirmpassword='';
				$scope.msgerr = 'Password must be same';
		}
			$timeout(function () {
				file.result = response.data;
			});
	    }, function (response) {
	      	if (response.status > 0)
	        $scope.errorMsg = response.status + ': ' + response.data;
	    }, function (evt) {
	      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
	    });
	}

	if($stateParams.merchantId){
		MerchantService.editMerchant($stateParams.merchantId, function(response) {
			if(response.messageId == 200) {
				$scope.Merchant = response.data;
				if(response.data.businessType == "physical"){
					$scope.Merchant.businessType = 1;
				}else if (response.data.businessType == "ecom") {
					$scope.Merchant.businessType = 2;
				}else{
					$scope.Merchant.businessType = 3;
				}
				$scope.Merchant.categories = response.data.category[0];
				SubCategoryService.fetchSubCategories($scope.Merchant.categories,function(response2) {
					var data = response2.data;
					var newProArr = [];
					for(var id in data) {
						var obj = {id:data[id]._id, name:data[id].name};
						newProArr.push(obj);
					}
					$scope.subcategories = newProArr;
					$scope.Merchant.subcategories = response.data.subcategory[0];
					$scope.Merchant._id = response.data._id;
				});
				MerchantService.getCountry($scope.Merchant.country,function(response) {
						var data = response.data;
						$scope.states = response.states;
				});
			}
		});
	}


	$scope.updateMerchant = function() {
		//console.log($scope.Merchant);console.log($scope.picFile);return false;
		if($scope.Merchant.pic){
			/////////////////Uploading Pic Start///////////////
			var file = $scope.Merchant.pic;
			file.upload = Upload.upload({
		      	url: '/merchants/upload',
		      	data: {file: file},
		    });

		    file.upload.then(function (response) {
		   		$scope.Merchant.image = response.data;
				if($scope.Merchant.pic){
					delete $scope.Merchant.pic;
				}
				MerchantService.updateMerchant($scope.Merchant, function(response) {
					if(response.messageId == 200) {	
					$scope.msgerr = '';				
						$state.go('manageMerchant');
					} else{
						$scope.msgerr = response.message;
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
			if($scope.Merchant.pic){
				delete $scope.Merchant.pic;
			}
			//console.log($scope.Offer);return false;
			MerchantService.updateMerchant($scope.Merchant, function(response) {
			if(response.messageId == 200) {					
					$state.go('manageMerchant');
				}
			});
		}
		
	}


	$scope.deleteImageMerchant = function (merchantId,merchantImg) {
      	var ask = confirm('Are you sure to delete this image');
      	var jsonString = "";
		if (ask) {
			jsonString = '{"merchantId": "'+merchantId+'", "image":"'+merchantImg+'"}';
		    MerchantService.deleteImageMerchant(jsonString, function (response) {
		    	if (response.data.messageId == 200) {
					$state.reload();
				}
			})
      	}
	};


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
				MerchantService.deleteMerchant(inputJsonString, function(response) {
					if(response.messageId == 200){
						$state.reload();
					}
				});
			}
			else {
				MerchantService.statusMerchant(inputJsonString, function(response) {
					if(response.messageId == 200){
						$scope.message = response.message;
						$state.reload();
					}
				});
			}
		}
	}
}])