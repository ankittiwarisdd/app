"use strict"

angular.module("Merchant")

.factory('MerchantService', ['$http', 'communicationService', function($http, communicationService) {

    var service = {};
    
    service.Login = function(inputJsonString, callback) {
		communicationService.resultViaPost(webservices.authenticate, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});	
	}

	service.logout = function(callback) {
		communicationService.resultViaGet(webservices.logout, appConstants.authorizationKey,"", function(response) {
			callback(response.data);
		});
	}
	service.resendPassword = function(inputJsonString, callback) {
		communicationService.resultViaPost(webservices.forgot_password, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}

	service.resetMerchantPassword = function(inputJsonString, callback) {
		communicationService.resultViaPost(webservices.resetMerchantPassword, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}

	service.findSubCategory = function(inputJsonString, callback) {
		communicationService.resultViaPost(webservices.findSubCategory, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
			callback(response.data);
		});
	}

	service.findLatLong = function(merchantId, callback) {
		var httpObj = $http.get('/merchants/findLatLong/'+merchantId);     
          httpObj.then(function (response) {
               callback(response.data);
          })
	}
	service.editMerchant = function(merchantId, callback) {
          var serviceURL = webservices.editMerchant + "/" + merchantId;
          communicationService.resultViaGet(serviceURL, appConstants.authorizationKey, "", function(response) {
               callback(response.data);
          });
    }
    service.updateMerchant = function(inputJsonString, callback) {
          communicationService.resultViaPost(webservices.updateMerchant, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
               callback(response.data);
          });
    }
    service.getOfferCount = function(id,callback) {
		  var serviceURL =  webservices.getDashCount + "/" + id;
          communicationService.resultViaGet(serviceURL,appConstants.authorizationKey,headerConstants.json,function(response){
           callback(response.data);
          });
     }
	service.getCountry = function(country, callback) {
          var httpObj = $http.get('/merchants/getCountry/'+country);     
          httpObj.then(function (response) {
               callback(response.data);
          })
     }     

    return service;
}]);