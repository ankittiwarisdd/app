"use strict";
app.controller('CategoryController', ['$scope', 'Upload', '$timeout', 'CategoryService', '$state', 'ngTableParams', '$stateParams', '$location',  function($scope, Upload, $timeout, CategoryService, $state, ngTableParams, $stateParams, $location){

	//if($location.$$url == "/manage/"){
		CategoryService.manage (function(response) {		
			if(response.messageId == 200) {
				$scope.filter = {name: ''};
				$scope.tableParams = new ngTableParams({page:1, count:10, sorting:{name:"asc"}, filter:$scope.filter}, { total:response.data.length, counts:[], data: response.data});
				
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


	$scope.addCategory = function() {
		var file = $scope.picFile;
		file.upload = Upload.upload({
	      	url: '/categories/upload',
	      	data: {file: file},
	    });

	    file.upload.then(function (response) {
	   		$scope.Category.image = response.data;
			CategoryService.saveCategory($scope.Category, function(response) {
			if(response.messageId == 200) {	
			        $state.go('manageCategory');
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
	}

	if($stateParams.catId){
		CategoryService.editCategory($stateParams.catId, function(response) {
			if(response.messageId == 200) {
				$scope.Category = response.data;
			}
		});
	}


	$scope.updateCategory = function() {
		if($scope.Category.pic){
			/////////////////Uploading Pic Start///////////////
			var file = $scope.Category.pic;
			file.upload = Upload.upload({
		      	url: '/categories/upload',
		      	data: {file: file},
		    });

		    file.upload.then(function (response) {
		   		$scope.Category.image = response.data;
				if($scope.Category.pic){
					delete $scope.Category.pic;
				}
				CategoryService.updateCategory($scope.Category, function(response) {
				if(response.messageId == 200) {					
						$state.go('manageCategory');
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
			if($scope.Category.pic){
				delete $scope.Category.pic;
			}
			//console.log($scope.Offer);return false;
			CategoryService.updateCategory($scope.Category, function(response) {
			if(response.messageId == 200) {					
					$state.go('manageCategory');
				}
			});
		}
		
	}


	$scope.deleteImage = function (categoryId,categoryImg) {
      	var ask = confirm('Are you sure to delete this image');
      	var jsonString = "";
		if (ask) {
			jsonString = '{"categoryId": "'+categoryId+'", "image":"'+categoryImg+'"}';
		    CategoryService.deleteImage(jsonString, function (response) {
		    	if (response.data.messageId == 200) {
					$state.go('manageCategory');
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
				CategoryService.deleteCategory(inputJsonString, function(response) {
					if(response.messageId == 200){
						$location.path('#/manage/');
					}
				});
			}
			else {
				CategoryService.statusCategory(inputJsonString, function(response) {
					if(response.messageId == 200){
						$location.path('#/manage/');
					}
				});
			}
		}
	}
}])