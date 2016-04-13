"use strict";
app.controller('OfferTypeController', ['$scope', 'Upload', '$timeout', 'OfferTypeService', '$state', 'ngTableParams', '$stateParams', '$location',  function($scope, Upload, $timeout, OfferTypeService, $state, ngTableParams, $stateParams, $location){

	//if($location.$$url == "/manage/"){
		OfferTypeService.manage (function(response) {		
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


	$scope.addOfferType = function() {		
		OfferTypeService.saveOfferType($scope.OfferType, function(response) {
		if(response.messageId == 200) {	
		        $state.go('manageOfferType');
			}
		 });
	}

	if($stateParams.offertypeId){
		OfferTypeService.editOfferType($stateParams.offertypeId, function(response) {
			if(response.messageId == 200) {
				$scope.OfferType = response.data;
			}
		});
	}


	$scope.updateOfferType = function() {
		OfferTypeService.updateOfferType($scope.OfferType, function(response) {
			if(response.messageId == 200) {					
				$state.go('manageOfferType');
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
				OfferTypeService.deleteOfferType(inputJsonString, function(response) {
					if(response.messageId == 200){
						$location.path('#/manage/');
					}
				});
			}
			else {
				OfferTypeService.statusOfferType(inputJsonString, function(response) {
					if(response.messageId == 200){
						$location.path('#/manage/');
					}
				});
			}
		}
	}
}])