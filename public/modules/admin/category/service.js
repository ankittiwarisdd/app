"use strict"

angular.module("Category")

.factory('CategoryService', ['$http', 'communicationService', function($http, communicationService) {

     var service = {};

     service.manage = function(callback) {
               communicationService.resultViaGet(webservices.getCategoryList, appConstants.authorizationKey, headerConstants.json, function(response) {
               callback(response.data);
          });
     }
     service.saveCategory = function(inputJsonString, callback) {
               communicationService.resultViaPost(webservices.addCategory, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
               callback(response.data);
          });
     }
     service.editCategory = function(catId, callback) {
          var serviceURL = webservices.editCategory + "/" + catId;
          communicationService.resultViaGet(serviceURL, appConstants.authorizationKey, "", function(response) {
               callback(response.data);
          });
     }
     service.deleteImage = function (jsonString,callback) {
               var httpObj = $http.post('/categories/deleteImage/',jsonString);
               httpObj.then(function (result) {
                    callback(result);
               })
     }
     service.updateCategory = function(inputJsonString, callback) {
          communicationService.resultViaPost(webservices.updateCategory, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
               callback(response.data);
          });
     }
     service.deleteCategory = function(inputJsonString, callback) {
               communicationService.resultViaPost(webservices.deleteCategory, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
               callback(response.data);
          });
     }
     service.statusCategory = function(inputJsonString, callback) {
               communicationService.resultViaPost(webservices.statusCategory, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
               callback(response.data);
          });
     }
     return service;
}]);