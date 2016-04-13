'use strict'

//var mainapp=angular.module("ecommerceapp",[]);

app.factory('AuthenticationService', ['communicationService', '$rootScope', 
	function(communicationService, $rootScope) {

	var service = {};

	service.Login = function(inputJsonString, callback) {
			communicationService.resultViaPost(webservices.authenticate, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {

			callback(response.data);

		});	
	}

	service.resendPassword = function(inputJsonString, callback) {
		communicationService.resultViaPost(webservices.forgot_password, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}

	service.resetAdminPassword = function(inputJsonString, callback) {
		communicationService.resultViaPost(webservices.resetAdminPassword, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}

	service.logout = function(callback) {
		communicationService.resultViaGet(webservices.logout, appConstants.authorizationKey,"", function(response) {
			callback(response.data);
		});
	}
	service.changePassword = function(user,callback) {
		communicationService.resultViaPost(webservices.changePassword, appConstants.authorizationKey, headerConstants.json, user, function(response) {

			callback(response.data);

		});	
	}

     return service;
}])

// app.factory('LocalService', [ '$rootScope', function($rootScope) { 
// 	return {
// 		getValue : function () {
// 			var isLoggedIn = true;
// 		},
// 		setValue : function () {
// 			var isLoggedIn = true;
// 		},
// 	} 
	
// }])
