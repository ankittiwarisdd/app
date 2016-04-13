"use strict"

angular.module("Home")

.factory('HomeService', ['$http', 'communicationService', function($http, communicationService) {

     var service = {};

     service.home = function(callback) {
        communicationService.resultViaGet(webservices.home, appConstants.authorizationKey, headerConstants.json, function(response) {
            callback(response.data);
        });
     }
     service.getSubCat = function(catId,callback) {
var serviceURL = webservices.getSubCat + "/" + catId;     	
communicationService.resultViaGet(serviceURL, appConstants.authorizationKey, headerConstants.json, function(response) {
            callback(response.data);
        });
     }
     service.getOffer = function(offerId,callback) {
     	var serviceURL = webservices.getOffer + "/" + offerId;
     	communicationService.resultViaGet(serviceURL, appConstants.authorizationKey, headerConstants.json, function(response) {
            console.log(response.data);
            callback(response.data);
        });
     }
     service.sendMessage = function (inputJSON,callback) {
         communicationService.resultViaPost(webservices.sendSmeMessage,appConstants.authorizationKey, headerConstants.json,inputJSON,function (response) {
            callback(response.data); 
         });
     }
     return service;
}]);