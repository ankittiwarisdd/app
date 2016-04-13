"use strict";
app.controller('DashboardController',['$scope','$state','$stateParams','MerchantService','$localStorage',function($scope,$state,$stateParams, MerchantService,$localStorage){
	console.log($localStorage);
	$scope.dashCount = {};
	MerchantService.getOfferCount($localStorage.userId, function(response) {
		if(response.messageId == 200){
	       $scope.dashCount.downloadedOffers = response.downloadedOffers;
		}
	});
}])

app.controller('MerchantController', ['$scope','$remember','$rootScope', 'Upload', '$timeout', '$state', '$stateParams', '$location', 'MerchantService', '$localStorage','$window','SubCategoryService', 'CategoryService',  function($scope, $remember, $rootScope, Upload, $timeout, $state, $stateParams, $location, MerchantService, $localStorage, $window, SubCategoryService, CategoryService){

		var inputJSON = "";
		$scope.remember = false;
		$scope.merchantId = $localStorage.userId;
		//console.log($localStorage.userId);
		if($remember('username') ) {
			$scope.remember = true;
			$scope.username = $remember('username');
			$scope.password = $remember('password');
		}
		if ($rootScope.message) {
			//code
			$scope.message=$rootScope.message;
			$rootScope.message="";
		}


		

		$scope.cancel = function() {
			$state.go($state.current, {}, {reload: true});
		}

		$scope.fetchStates = function(country, cb) {
				MerchantService.getCountry(country,function(response) {
				var data = response.data;
				$scope.states = response.states;
			});
		};
		//login
		$scope.login = function() {
				if ($scope.remember=="undefined") {
					$scope.remember=false;
	            }
				
				if ($scope.remember) {
	                $remember('email', $scope.email);
	                $remember('password', $scope.password);
	            } else {
	                $remember('email', '');
	                $remember('password', '');
	            }
				inputJSON = '{"email":' + '"' + $scope.email + '", "password":' + '"' + $scope.password + '","remember":' + '"' + $scope.remember +'"}';
				
				MerchantService.Login(inputJSON, function(response) {
				 $scope.errmsg = '';	
				if(response.messageId == 200) {
					$localStorage.userId = response.merchant._id;
					$window.localStorage['userLoggedIn'] = 10;
	        		$localStorage.userLoggedIn = true;
	        		$scope.$emit('isLogged', {message: {userLoggedIn : true}});
					$localStorage.loggedInEmail = $scope.email;
					  $state.go('dashboard', {}, { reload: true });
				}
				else {	
					if(response == "Unauthorized") {
						$scope.errmsg = "Either Email or Password is incorrect";
					}else if (response=="Bad Request") {
						$scope.errmsg = "Please Enter Email and Password";
	                }
					$scope.error = $scope.errmsg;
				}
			});
		};


		//logout
		$scope.logout = function() {
			MerchantService.logout(function(response) {
				if(response.messageId == 200) {   
						$localStorage.userLoggedIn = false;
						$localStorage.loggedInEmail = false;
						$window.localStorage['userLoggedIn'] = 11;
						$scope.$emit('isLogged', {message: {userLoggedIn : false}});
						$state.go("login");
				}
				else {
					$scope.message = response.message;
				}
			});		
		}


		//forgot password
		$scope.resendPassword = function() {

			inputJSON = '{"email":' + '"' + $scope.email + '"}';

			MerchantService.resendPassword(inputJSON, function(response) {

				if(response.messageId == 200) {
					
					$scope.message = response.message;
				}
				else {
					$scope.message = response.message;
				}

			});
		}


		//reset password
		$scope.reset = function(user) {
			$scope.user.token = $state.params.token;
			var userData = '{"newPassword":"' + $scope.user.password2 + '","token":"' + $scope.user.token + '"}';
			//console.log(userData);return false;
			//DO CODE AS REQUIRED FURTHER FOR SELLER FORGOT PWD and REDIRECTION
			MerchantService.resetMerchantPassword(userData, function(response) {

				if(response.messageId == 200) {
					
					$rootScope.message = response.message;
	        		$state.go('front.adminLogin');
				}
				else {
					$scope.message = response.message;
				}

			});
			
		}

		

		if($stateParams.merchantId){
			//console.log("here");return false;
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
						$scope.Merchant.id = response.data._id;
					});
					MerchantService.getCountry($scope.Merchant.country,function(response) {
							var data = response.data;
							$scope.states = response.states;
					});
					CategoryService.manage(function(response) {
						var data = response.data;
						var newCatArr = [];
						for(var id in data) {
							var obj = {id:data[id]._id, name:data[id].name};
							newCatArr.push(obj);
						}
						$scope.categories = newCatArr;
					});
				}
			});
		}


		$scope.updateProfile = function() {
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
							$state.go('dashboard');
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
						$state.go('dashboard');
					}
				});
			}		
		}


		$scope.deleteImageMerchant = function (merchantId,merchantImg) {
	      	var ask = confirm('Are you sure to delete this image');
	      	var jsonString = "";
			if (ask) {
				jsonString = '{"merchantId": "'+merchantId+'", "image":"'+merchantImg+'"}';
				// /console.log(jsonString);return false;
			    MerchantService.deleteImageMerchant(jsonString, function (response) {
			    	if (response.data.messageId == 200) {
						$state.reload();
					}
				})
	      	}
		};


		$scope.changePassword = function() {
			$scope.Merchant.userId = $localStorage.userId;
			MerchantService.changePassword($scope.Merchant, function(response) {
				var errorMessage = '';					
				if(response.messageId == 200) {
					$scope.msgerr = '';
					$scope.msg = response.message;
				}
				else {	
	          		$scope.msg = '';
					$scope.msgerr = response.message;
				}
			});
		};
}])

app.controller('NavController', ['$scope', '$localStorage', function($scope, $localStorage){
	
	$scope.isLoggedIn = false;
	
	$scope.$on('BroadcastData', function(event, args) {
        $scope.isLoggedIn = args.message.userLoggedIn;	
        $localStorage.userLoggedIn = $scope.isLoggedIn;
    });
	
	if($localStorage.userLoggedIn)  {
		$scope.isLoggedIn = $localStorage.userLoggedIn;	
	}
	
}]);