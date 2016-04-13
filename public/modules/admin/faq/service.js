"use strict"

angular.module("Faq")

.factory('FaqService', ['$http', 'communicationService', function($http, communicationService) {

     var service = {};

     service.manageFaq = function(callback) {
               communicationService.resultViaGet(webservices.getFaqList, appConstants.authorizationKey, headerConstants.json, function(response) {
               callback(response.data);
          });
     }
     service.saveFaq = function(inputJsonString, callback) {
               communicationService.resultViaPost(webservices.addFaq, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
               callback(response.data);
          });
     }
     service.editFaq = function(faqId, callback) {
          var serviceURL = webservices.editFaq + "/" + faqId;
          communicationService.resultViaGet(serviceURL, appConstants.authorizationKey, "", function(response) {
               callback(response.data);
          });
     }
     service.viewFaq = function(faqId, callback) {
          var serviceURL = webservices.viewFaq + "/" + faqId;
          communicationService.resultViaGet(serviceURL, appConstants.authorizationKey, "", function(response) {
               callback(response.data);
          });
     }
     service.updateFaq = function(inputJsonString, callback) {
          communicationService.resultViaPost(webservices.updateFaq, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
               callback(response.data);
          });
     }
     return service;
}]);