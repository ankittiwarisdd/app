"use strict"

angular.module("SiteContent")

.factory('SiteContentService', ['$http', 'communicationService', function($http, communicationService) {

     var service = {};

     service.manageSiteContent = function(callback) {
               communicationService.resultViaGet(webservices.getSiteContentList, appConstants.authorizationKey, headerConstants.json, function(response) {
               callback(response.data);
          });
     }
     service.saveSiteContent = function(inputJsonString, callback) {
               communicationService.resultViaPost(webservices.addSiteContent, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
               callback(response.data);
          });
     }
     service.editSiteContent = function(sitecontentId, callback) {
          var serviceURL = webservices.editSiteContent + "/" + sitecontentId;
          communicationService.resultViaGet(serviceURL, appConstants.authorizationKey, "", function(response) {
               callback(response.data);
          });
     }
     service.viewSiteContent = function(sitecontentId, callback) {
          var serviceURL = webservices.viewSiteContent + "/" + sitecontentId;
          communicationService.resultViaGet(serviceURL, appConstants.authorizationKey, "", function(response) {
               callback(response.data);
          });
     }
     service.updateSiteContent = function(inputJsonString, callback) {
          communicationService.resultViaPost(webservices.updateSiteContent, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
               callback(response.data);
          });
     }
     return service;
}]);