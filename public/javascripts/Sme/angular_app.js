
angular.module("communicationModule", []);
angular.module("Merchant", []);
angular.module("Offer", []);
angular.module("Category", []);
angular.module("SubCategory", []);
angular.module("OfferType", []);
var app = angular.module('smeApp',['ui.router', 'ngLoadingSpinner','ngStorage','ngRoute','ngFileUpload','communicationModule','ngTable','Merchant','Offer','Category','SubCategory','OfferType']);

app.run(function($localStorage, $rootScope, $state) {

	$rootScope.$on('isLogged', function(event, args) {
        $rootScope.$broadcast('BroadcastData', args);
    });

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

    });
})

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
 	$stateProvider 
		        .state('login', {
						url: '/',
		               	templateUrl: function() { if(window.localStorage['userLoggedIn'] == 10){
		               		return '/modules/sme/self/views/dashboard.html';
		               	} else { 
		               	    return '/modules/sme/self/views/login.html';
		               }
		           },
		               	controller : 'MerchantController'
		        })	
 				.state('dashboard', {
						url: '/dashboard',
		               	templateUrl: function() { if(window.localStorage['userLoggedIn'] == 10){
		               		return '/modules/sme/self/views/dashboard.html';
		               	} else { 
		               	    return '/modules/sme/self/views/login.html';
		               }
		           },
		               	controller : 'DashboardController'
		        })		        
		        .state('editProfile', {
						url: '/editProfile/:merchantId',
		               	templateUrl: '/modules/sme/self/views/editProfile.html',
		               	controller : 'MerchantController'
		        })		        
		        .state('changePassword', {
						url: '/changePassword/',
		               	templateUrl: '/modules/sme/self/views/changePassword.html',
		               	controller : 'MerchantController'
		        })
		        .state('addOffer', {
						url: '/addOffer/',
		               	templateUrl: '/modules/sme/offer/views/addOffer.html',
		               	controller : 'OfferController'
		        })
		        .state('manageOffer', {
						url: '/manageOffer/',
		               	templateUrl: '/modules/sme/offer/views/manageOffers.html',
		               	controller : 'OfferController'
		        })
		        .state('editOffer', {
						url: '/editOffer/:offerId',
		               	templateUrl: '/modules/sme/offer/views/editOffer.html',
		               	controller : 'OfferController'
		        })
		        .state('viewOffer', {
						url: '/viewOffer/:offerId/:action',
		               	templateUrl: '/modules/sme/offer/views/viewOffer.html',
		               	controller : 'OfferController'
		        })
			$urlRouterProvider.otherwise("/");
}]);
