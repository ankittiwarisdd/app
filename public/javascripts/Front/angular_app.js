
angular.module("communicationModule", []);
angular.module("Home", []);
angular.module("Category", []);
angular.module("SubCategory", []);
angular.module("Merchant", []);
angular.module("Offer", []);
angular.module("OfferType", []);
var app = angular.module('frontApp',['ngAnimate','ui.router', 'ngLoadingSpinner','ngMessages','ngStorage','ngRoute','communicationModule','Home','Category','SubCategory','Merchant','ngFileUpload','Offer','OfferType']);

app.run(function($localStorage, $rootScope, $state, $window) {

	$window.scrollTo(0, 0);
    $rootScope.$on('isLogged', function(event, args) {
        $rootScope.$broadcast('BroadcastData', args);
    });

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

    });
})

app.constant ('AccessLevels', {
	anon :1,
	user : 2
})

app.config(function($stateProvider, $urlRouterProvider, AccessLevels) {
 	$stateProvider
 				.state('front', {
						abstract :true,
						template: '<ui-view/>',
						data : AccessLevels.anon						
		        })
  				.state('front.home', {
						url: '/',
		               	templateUrl: '/modules/home/views/index.html',
		               	controller : 'HomeController'
		        })
		        .state('front.register', {
						url: '/merchants/register',
		               	templateUrl: function(){
		               		if(window.localStorage['userLoggedIn'] == 10){
		               			return '/modules/merchant/views/dashboard.html';
		               		}else{
		               			return '/modules/merchant/views/register.html';
		               		}
		               	},
		               	controller : 'MerchantController'
		        })
		        .state('front.login', {
						url: '/merchants/login',
		               	templateUrl: function(){
		               		if(window.localStorage['userLoggedIn'] == 10){
		               			return '/modules/merchant/views/dashboard.html';
		               		}else{
		               			return '/modules/merchant/views/login.html';
		               		}
		               	},
		               	controller : 'MerchantController'
		        })		        
		        .state('front.forgot', {
						url: '/merchants/forgotPassword/',
		               	templateUrl: '/modules/merchant/views/forgot-password.html',
		               	controller : 'MerchantController'
		        })
		        .state('front.reset', {
						url: '/merchants/reset/:token',
		               	templateUrl: '/modules/merchant/views/reset.html',
		               	controller : 'MerchantController'
		        })
		        .state('front.dashboard', {
						url: '/merchants/dashboard/',
		               	templateUrl: '/modules/merchant/views/dashboard.html',
		               	controller : 'MerchantController'
		        })
		        .state('front.addOffer', {
						url: '/offers/addOffer/',
		               	templateUrl: '/modules/offer/views/addOffer.html',
		               	controller : 'OfferController'
		        })
		        .state('front.service', {
						url: '/home/service',
		               	templateUrl: '/modules/home/views/service.html',
		               	controller : 'ServiceController'
		        })
		         .state('front.category', {
						url: '/home/service/:id',
		               	templateUrl: '/modules/home/views/category.html',
		               	controller : 'CategoryController'
		        })
	$urlRouterProvider.otherwise("/");
});
