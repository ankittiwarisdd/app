"use strict"

angular.module("OfferType")

.factory('OfferTypeService', ['$http', 'communicationService', function($http, communicationService) {

     var service = {};

     service.manage = function(callback) {
               communicationService.resultViaGet(webservices.getOfferTypeList, appConstants.authorizationKey, headerConstants.json, function(response) {
               callback(response.data);
          });
     }
     service.saveOfferType = function(inputJsonString, callback) {
               communicationService.resultViaPost(webservices.addOfferType, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
               callback(response.data);
          });
     }
     service.editOfferType = function(catId, callback) {
          var serviceURL = webservices.editOfferType + "/" + catId;
          communicationService.resultViaGet(serviceURL, appConstants.authorizationKey, "", function(response) {
               callback(response.data);
          });
     }
     service.updateOfferType = function(inputJsonString, callback) {
          communicationService.resultViaPost(webservices.updateOfferType, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
               callback(response.data);
          });
     }
     service.deleteOfferType = function(inputJsonString, callback) {
               communicationService.resultViaPost(webservices.deleteOfferType, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
               callback(response.data);
          });
     }
     service.statusOfferType = function(inputJsonString, callback) {
               communicationService.resultViaPost(webservices.statusOfferType, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
               callback(response.data);
          });
     }
     return service;
}]);