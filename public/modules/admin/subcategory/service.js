"use strict"

angular.module("SubCategory")

.factory('SubCategoryService', ['$http', 'communicationService', function($http, communicationService) {

     var service = {};

     service.manageSubCategory = function(callback) {
               communicationService.resultViaGet(webservices.getSubCategoryList, appConstants.authorizationKey, headerConstants.json, function(response) {
               callback(response.data);
          });
     }
     service.saveSubCategory = function(inputJsonString, callback) {
               communicationService.resultViaPost(webservices.addSubCategory, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
               callback(response.data);
          });
     }
     service.editSubCategory = function(catId, callback) {
          var serviceURL = webservices.editSubCategory + "/" + catId;
          communicationService.resultViaGet(serviceURL, appConstants.authorizationKey, "", function(response) {
               callback(response.data);
          });
     }
     service.updateSubCategory = function(inputJsonString, callback) {
          communicationService.resultViaPost(webservices.updateSubCategory, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
               callback(response.data);
          });
     }
     service.deleteSubCategory = function(inputJsonString, callback) {
               communicationService.resultViaPost(webservices.deleteSubCategory, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
               callback(response.data);
          });
     }
     service.statusSubCategory = function(inputJsonString, callback) {
               communicationService.resultViaPost(webservices.statusSubCategory, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
               callback(response.data);
          });
     }     
     service.fetchSubCategories = function(item, callback) {
          var httpObj = $http.get('/subcategories/fetchlist/'+item);     
          httpObj.then(function (response) {
               callback(response.data);
          })
     }
     return service;
}]);