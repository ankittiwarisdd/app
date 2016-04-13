"use strict"

angular.module("Offer")

.factory('OfferService', ['$http', 'communicationService', function($http, communicationService) {

     var service = {};

    service.saveOffer = function(inputJsonString, callback) {
        communicationService.resultViaPost(webservices.saveOffer, appConstants.authorizationKey, headerConstants.json, inputJsonString, function(response) {
            callback(response.data);
        });
    }
     return service;
}]);