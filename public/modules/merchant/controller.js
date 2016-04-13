"use strict";
app.controller('MerchantController', ['$scope','$remember','$rootScope', 'Upload', '$timeout', 'CategoryService', '$state', '$stateParams', '$location', 'SubCategoryService', 'MerchantService', '$localStorage','$window',  function($scope, $remember, $rootScope, Upload, $timeout, CategoryService, $state, $stateParams, $location, SubCategoryService, MerchantService, $localStorage, $window){
        $window.scrollTo(0, 0);
		var inputJSON = "";
		$scope.remember = false;
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


		CategoryService.manage(function(response) {
			//console.log("HERE I'M");console.log(response);return false;
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


		$scope.register = function() {
			//console.log($scope.Merchant);console.log($scope.picFile);return false;
			var file = $scope.picFile;
			file.upload = Upload.upload({
		      	url: '/merchants/uploadPic',
		      	data: {file: file},
		    });

		    file.upload.then(function (response) {
		   		$scope.Merchant.image = response.data;
		   		if($scope.Merchant.password==$scope.Merchant.confirmpassword) {
				MerchantService.registerMerchant($scope.Merchant, function(response) {
					//console.log(response);return false;
				if(response.messageId == 200) {	
					$scope.msgerr= '';
      	            $scope.msg = 'Your rgestration has been successfull, Please login to enjoy the services';
                    $window.location.href = "/sme/#";

					} else {
						$scope.msgerr = response.message;
					}
				 
				 });
			} else {
				$scope.Merchant.password ='';
				$scope.Merchant.confirmpassword='';
				$scope.msgerr = 'Password must be same'
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
	                $remember('username', $scope.username);
	                $remember('password', $scope.password);
	            } else {
	                $remember('username', '');
	                $remember('password', '');
	            }
				inputJSON = '{"username":' + '"' + $scope.username + '", "password":' + '"' + $scope.password + '","remember":' + '"' + $scope.remember +'"}';
				
			   	//console.log($remember);
				//console.log(inputJSON); /sme/dashboard
			   //return false;
				MerchantService.Login(inputJSON, function(response) {
				var errorMessage = '';
				//console.log(response.merchant.id._id);return false;	
				if(response.messageId == 200) {
					
					$localStorage.userId = response.merchant.id._id;
					$window.localStorage['userLoggedIn'] = 10;
	        		$localStorage.userLoggedIn = true;
	        		$scope.$emit('isLogged', {message: {userLoggedIn : true}});
					$localStorage.loggedInUsername = $scope.username;		
					//console.log($localStorage);				
					//$state.go('dashboard');
					$state.go('front.dashboard');
					//$location.path
				}
				else {	

					if(response == "Unauthorized") {
						errorMessage = "Either Username or Password is incorrect";
					}else if (response=="Bad Request") {
						errorMessage = "Please Enter Username and Password";

	                    //code
	                }

					$scope.error = errorMessage;
				}
			});
		};


		//logout
		$scope.logout = function() {
			//console.log("here");return false;
			MerchantService.logout(function(response) {
	            //console.log(response);
				if(response.messageId == 200) {
						console.log("Hell @@@@@");    
						$localStorage.userLoggedIn = false;
						$window.localStorage['userLoggedIn'] = 11;
						$scope.$emit('isLogged', {message: {userLoggedIn : false}});
						$state.go("front.login");
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
	        		$window.location.href = "/sme/#";
				}
				else {
					$scope.message = response.message;
				}

			});
			
		}
}])