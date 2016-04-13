"use strict";
app.controller('SubCategoryController', ['$scope', 'Upload', '$timeout', 'CategoryService', '$state', 'ngTableParams', '$stateParams', '$location', 'SubCategoryService',  function($scope, Upload, $timeout, CategoryService, $state, ngTableParams, $stateParams, $location, SubCategoryService){

		CategoryService.manage(function(response) {
			var data = response.data;
			var newCatArr = [];
			for(var id in data) {
				var obj = {id:data[id]._id, name:data[id].name};
				newCatArr.push(obj);
			}
			$scope.categories = newCatArr;
		});

	//if($location.$$url == "/manage/"){
		SubCategoryService.manageSubCategory (function(response) {		
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


	$scope.addSubCategory = function() {
		SubCategoryService.saveSubCategory($scope.SubCategory, function(response) {
			if(response.messageId == 200) {	
			    $state.go('manageSubCategory');
			}
		});
	}

	if($stateParams.subCatId){
		SubCategoryService.editSubCategory($stateParams.subCatId, function(response) {
			if(response.messageId == 200) {
				//console.log(response.data);
				$scope.SubCategory = response.data;
				$scope.SubCategory.category = response.data.category[0];
				//console.log(response.data.category[0]);
				$scope.SubCategory.oldCategory = response.data.category;
			}
		});
	}


	$scope.updateSubCategory = function() {
		//console.log($scope.SubCategory);return false;
		SubCategoryService.updateSubCategory($scope.SubCategory, function(response) {
		if(response.messageId == 200) {					
				$state.go('manageSubCategory');
			}
		});		
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
				SubCategoryService.deleteSubCategory(inputJsonString, function(response) {
					if(response.messageId == 200){
						$state.go('manageSubCategory');
					}
				});
			}
			else {
				SubCategoryService.statusSubCategory(inputJsonString, function(response) {
					if(response.messageId == 200){
						$state.go('manageSubCategory');
					}
				});
			}
		}
	}
}])