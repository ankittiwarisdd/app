"use strict";
app.controller('FaqController', ['$scope', 'Upload', '$timeout', '$state', 'ngTableParams', '$stateParams', '$location', 'FaqService',  function($scope, Upload, $timeout, $state, ngTableParams, $stateParams, $location, FaqService){


	//if($location.$$url == "/manage/"){
		FaqService.manageFaq(function(response) {		
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


	$scope.addFaq = function() {
		FaqService.saveFaq($scope.Faq, function(response) {
			if(response.messageId == 200) {	
			    $state.go('manageFaq');
			}
		});
	}

	if($stateParams.faqId && !$stateParams.action){
		FaqService.editFaq($stateParams.faqId, function(response) {
			if(response.messageId == 200) {
				$scope.Faq = response.data;
			}
		});
	}else{
		if($stateParams.action){
			FaqService.viewFaq($stateParams.faqId, function(response) {
				if(response.messageId == 200) {
					$scope.Faq = response.data;
				}
			});
		}
	}


	$scope.updateFaq = function() {
		//console.log($scope.SubCategory);return false;
		FaqService.updateFaq($scope.Faq, function(response) {
		if(response.messageId == 200) {					
				$state.go('manageFaq');
			}
		});		
	}

}])