"use strict"

angular.module("Offer")

.factory('OfferService', ['$http', 'communicationService', function($http, communicationService) {

    var service = {};

    service.saveOffer = function(inputJsonString, callback) {
        communicationService.resultViaPost(webservices.saveOffer, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
            callback(response.data);
        });
    }
    service.manageOffers = function(merchantId,callback) {
		    var serviceURL = webservices.getOfferListMerchant + "/" + merchantId;
      	communicationService.resultViaGet(serviceURL, appConstants.authorizationKey, "", function(response) {
           callback(response.data);
      	});
	  }
    service.editOffer = function(offerId, callback) {
        var serviceURL = webservices.editOffer + "/" + offerId;
        communicationService.resultViaGet(serviceURL, appConstants.authorizationKey, "", function(response) {
             callback(response.data);
        });
    }
    service.deleteImageOffer = function (jsonString,callback) {
             var httpObj = $http.post('/offers/deleteImageOffer/',jsonString);
             httpObj.then(function (result) {
                  callback(result);
             })
    }
    service.updateOffer = function(inputJsonString, callback) {
        communicationService.resultViaPost(webservices.updateOffer, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
             callback(response.data);
        });
    }
    service.deleteOffer = function(inputJsonString, callback) {
             communicationService.resultViaPost(webservices.deleteOffer, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
             callback(response.data);
        });
    }
    service.statusOffer = function(inputJsonString, callback) {
             communicationService.resultViaPost(webservices.statusOffer, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
             callback(response.data);
        });
    }
    return service;
}]);