"use strict";


app.controller('loginController', ['$scope','$state','$remember','$rootScope', '$location', '$routeParams', 'AuthenticationService', '$localStorage','$window', function($scope,$state,$remember, $rootScope, $location, $routeParams, AuthenticationService, $localStorage, $window){

	
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
			//console.log(inputJSON);
		   //return false;
			AuthenticationService.Login(inputJSON, function(response) {
			$scope.errmsg= '';
				
			if(response.messageId == 200) {
				$localStorage.userId = response.user.id._id;
				var temp = true;
        		$window.localStorage['userLoggedIn'] = 10;
        		  $rootScope.userRole = 'loggedInUser';
        		$scope.$emit('isLogged', {message: {userLoggedIn : true}});
				$localStorage.loggedInUsername = $scope.username;		
				//console.log($localStorage);				
				//$state.go('dashboard');
					  $state.go('dashboard', {}, { reload: true });
			}
			else {	
				if(response == "Unauthorized") {
					$scope.errmsg = "Either Username or Password is incorrect";
				}else if (response=="Bad Request") {
					$scope.errmsg = "Please Enter Username and Password";

                    //code
                }

				$scope.error = $scope.errmsg;
			}
		});
	};
$scope.changePassword = function() {
			//console.log($remember);
			//console.log(inputJSON);
		   //return false;
		   $scope.user.userId = $localStorage.userId;
			AuthenticationService.changePassword($scope.user, function(response) {
			var errorMessage = '';
				
			if(response.messageId == 200) {
				$scope.msgerr = '';
				$scope.msg = response.message;
				//console.log('display message ur sucessfuly change ur password');
				//$location.path('/dashboard');
			}
			else {	
          $scope.msg = '';
				$scope.msgerr = response.message;
			}
		});
	};

	//logout
	$scope.logout = function() {
		//console.log("here");
		AuthenticationService.logout(function(response) {
              //console.log(response);
			if(response.messageId == 200) {
				    
					$window.localStorage['userLoggedIn'] = 11;
					 $rootScope.userRole = 'logedOutUser';
					$scope.$emit('isLogged', {message: {userLoggedIn : false}});
					$state.go('adminLogin', {}, {reload: true}); 
					//$state.go("adminLogin");
			}
			else {
				$scope.message = response.message;
			}

		});
	
	}


	//forgot password
	$scope.resendPassword = function() {

		inputJSON = '{"email":' + '"' + $scope.email + '"}';

		AuthenticationService.resendPassword(inputJSON, function(response) {

			if(response.messageId == 200) {
				
				$scope.message = response.message;
			}
			else {
				$scope.message = response.message;
			}

		});
	}


	//authentication
	$scope.authenticate = function(provider) {
	    
		$auth.authenticate(provider)
		.then(function(response) {
		
			$localStorage.userId = response.userId;
			$localStorage.userLoggedIn = true;
			$localStorage.loggedInUsername = response.data.displayName;
			$location.path('/home');
		})
		.catch(function(response) {
			
			$scope.error = response.data.message;
			$location.path('/login');
		});
		
	}


	$scope.reset = function(user) {
		$scope.user.token = $state.params.token;
		var userData = '{"newPassword":"' + $scope.user.password2 + '","token":"' + $scope.user.token + '"}';
			//console.log(userData);return false;
			//DO CODE AS REQUIRED FURTHER FOR SELLER FORGOT PWD and REDIRECTION
		AuthenticationService.resetAdminPassword(userData, function(response) {

			if(response.messageId == 200) {
				
				$rootScope.message = response.message;
        		$state.go('adminLogin');
			}
			else {
				$scope.message = response.message;
			}

		});
		
	}

}]);


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