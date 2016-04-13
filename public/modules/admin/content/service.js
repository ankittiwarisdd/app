"use strict"

angular.module("Content")

.factory('ContentService', ['$http', 'communicationService', function($http, communicationService) {

     var service = {};

     service.manageContent = function(callback) {
               communicationService.resultViaGet(webservices.getContentList, appConstants.authorizationKey, headerConstants.json, function(response) {
               callback(response.data);
          });
     }
     service.saveContent = function(inputJsonString, callback) {
               communicationService.resultViaPost(webservices.addContent, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
               callback(response.data);
          });
     }
     service.editContent = function(contentId, callback) {
          var serviceURL = webservices.editContent + "/" + contentId;
          communicationService.resultViaGet(serviceURL, appConstants.authorizationKey, "", function(response) {
               callback(response.data);
          });
     }
     service.viewContent = function(contentId, callback) {
          var serviceURL = webservices.viewContent + "/" + contentId;
          communicationService.resultViaGet(serviceURL, appConstants.authorizationKey, "", function(response) {
               callback(response.data);
          });
     }
     service.updateContent = function(inputJsonString, callback) {
          communicationService.resultViaPost(webservices.updateContent, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
               callback(response.data);
          });
     }
     return service;
}]);