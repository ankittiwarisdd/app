"use strict"

angular.module("Merchant")

.factory('MerchantService', ['$http', 'communicationService', function($http, communicationService) {

     var service = {};

     service.manageMerchant = function(callback) {
               communicationService.resultViaGet(webservices.getMerchantList, appConstants.authorizationKey, headerConstants.json, function(response) {
               callback(response.data);
          });
     }
     service.saveMerchant = function(inputJsonString, callback) {
               communicationService.resultViaPost(webservices.addMerchant, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
               callback(response.data);
          });
     }
     service.editMerchant = function(merchantId, callback) {
          var serviceURL = webservices.editMerchant + "/" + merchantId;
          communicationService.resultViaGet(serviceURL, appConstants.authorizationKey, "", function(response) {
               callback(response.data);
          });
     }
     service.deleteImageMerchant = function (jsonString,callback) {
               var httpObj = $http.post('/merchants/deleteImageMerchant/',jsonString);
               httpObj.then(function (result) {
                    callback(result);
               })
     }
     service.updateMerchant = function(inputJsonString, callback) {
          communicationService.resultViaPost(webservices.updateMerchant, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
               callback(response.data);
          });
     }
     service.deleteMerchant = function(inputJsonString, callback) {
               communicationService.resultViaPost(webservices.deleteMerchant, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
               callback(response.data);
          });
     }
     service.statusMerchant = function(inputJsonString, callback) {
               communicationService.resultViaPost(webservices.statusMerchant, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
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