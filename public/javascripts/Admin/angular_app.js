
angular.module("communicationModule", []);
angular.module("Category", []);
angular.module("SubCategory", []);
angular.module("Merchant", []);
angular.module("OfferType", []);
angular.module("Authentication", []);
angular.module("SiteContent", []);
angular.module("Content", []);
angular.module("Faq", []);
var app = angular.module('adminApp',['ui.router', 'ngStorage','ngLoadingSpinner','ngRoute','ngFileUpload','communicationModule','Category','ngTable','SubCategory','Merchant','OfferType','Authentication','SiteContent','Content','Faq']);

// var checkPage = function($http,$rootScope,$location){
  
// 		$http.get('/adminlogin/loggedin').then(function(response){
                 
//                    if (response.data.userId) { 
//                          $rootScope.userLoggedIn =true;					
//                    }else{
//                       	$rootScope.userLoggedIn =false;
//                         $location.path('/login');
//                    }
//         });
// };

app.run(function($localStorage, $rootScope, $state) {

	$rootScope.$on('isLogged', function(event, args) {
        $rootScope.$broadcast('BroadcastData', args);
    });

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

    });
})

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

 	$stateProvider
 				.state('adminLogin', {
						url: '/',
		               	templateUrl: function(){
		               		if(window.localStorage['userLoggedIn'] == 10){
		               			return '/modules/admin/self/views/dashboard.html';
		               		}else{
		               			return '/modules/admin/authentication/views/login.html';
		               		}
		               	},
		               	controller : 'loginController'
		        })					
		        .state('adminLogout', {
						url: '/',
		               	templateUrl: '/modules/admin/authentication/views/login.html',
		               	controller : 'loginController'
		        })
		        .state('adminforgot', {
						url: '/forgotPassword',
		               	templateUrl: '/modules/admin/authentication/views/forgot-password.html',
		               	controller : 'loginController'
		        })
		        .state('adminReset', {
						url: '/reset/:token',
						templateUrl : "/modules/admin/authentication/views/reset.html",
						controller: "loginController",
				})
  				.state('dashboard', {
						url: '/dashboard',
		               	templateUrl: function(){
		               		if(window.localStorage['userLoggedIn'] == 10){
		               			return '/modules/admin/self/views/dashboard.html';
		               		}else{
		               			return '/modules/admin/authentication/views/login.html';
		               		}
		               	},
		               	controller : 'DashboardController'
		        })
		        .state('addCategory', {
						url: '/addCategory/',
		               	templateUrl: '/modules/admin/category/views/addCategory.html',
		               	controller : 'CategoryController'
		        })
		        .state('manageCategory', {
						url: '/manage/',
		               	templateUrl: '/modules/admin/category/views/manage.html',
		               	controller : 'CategoryController'
		        })
		        .state('editCategory', {
						url: '/editCategory/:catId',
		               	templateUrl: '/modules/admin/category/views/editCategory.html',
		               	controller : 'CategoryController'
		        })
		        .state('addSubCategory', {
						url: '/addSubCategory/',
		               	templateUrl: '/modules/admin/subcategory/views/addSubCategory.html',
		               	controller : 'SubCategoryController'
		        })
		        .state('manageSubCategory', {
						url: '/manageSubCategory/',
		               	templateUrl: '/modules/admin/subcategory/views/manageSubCategory.html',
		               	controller : 'SubCategoryController'
		        })
		        .state('editSubCategory', {
						url: '/editSubCategory/:subCatId',
		               	templateUrl: '/modules/admin/subcategory/views/editSubCategory.html',
		               	controller : 'SubCategoryController'
		        })
		        .state('addMerchant', {
						url: '/addMerchant/',
		               	templateUrl: '/modules/admin/merchant/views/addMerchant.html',
		               	controller : 'MerchantController'
		        })
		        .state('manageMerchant', {
						url: '/manageMerchant/',
		               	templateUrl: '/modules/admin/merchant/views/manageMerchant.html',
		               	controller : 'MerchantController'
		        })
		        .state('editMerchant', {
						url: '/editMerchant/:merchantId',
		               	templateUrl: '/modules/admin/merchant/views/editMerchant.html',
		               	controller : 'MerchantController'
		        })		        
		        .state('addOfferType', {
						url: '/addOfferType/',
		               	templateUrl: '/modules/admin/offertype/views/addOfferType.html',
		               	controller : 'OfferTypeController'
		        })
		        .state('manageOfferType', {
						url: '/manageOfferType/',
		               	templateUrl: '/modules/admin/offertype/views/manage.html',
		               	controller : 'OfferTypeController'
		        })
		        .state('editOfferType', {
						url: '/editOfferType/:offertypeId',
		               	templateUrl: '/modules/admin/offertype/views/editOfferType.html',
		               	controller : 'OfferTypeController'
		        })		        	        
		        .state('addSiteContent', {
						url: '/addSiteContent/',
		               	templateUrl: '/modules/admin/sitecontent/views/addSiteContent.html',
		               	controller : 'SiteContentController'
		        })
		        .state('manageSiteContent', {
						url: '/manageSiteContent/',
		               	templateUrl: '/modules/admin/sitecontent/views/manageSiteContent.html',
		               	controller : 'SiteContentController'
		        })
		        .state('editSiteContent', {
						url: '/editSiteContent/:sitecontentId',
		               	templateUrl: '/modules/admin/sitecontent/views/editSiteContent.html',
		               	controller : 'SiteContentController'
		        })
		        .state('viewSiteContent', {
						url: '/viewSiteContent/:sitecontentId/:action',
		               	templateUrl: '/modules/admin/sitecontent/views/viewSiteContent.html',
		               	controller : 'SiteContentController'
		        })
		        .state('addContent', {
						url: '/addContent/',
		               	templateUrl: '/modules/admin/content/views/addContent.html',
		               	controller : 'ContentController'
		        })
		        .state('manageContent', {
						url: '/manageContent/',
		               	templateUrl: '/modules/admin/content/views/manageContent.html',
		               	controller : 'ContentController'
		        })
		        .state('editContent', {
						url: '/editContent/:contentId',
		               	templateUrl: '/modules/admin/content/views/editContent.html',
		               	controller : 'ContentController'
		        })
		        .state('viewContent', {
						url: '/viewContent/:contentId/:action',
		               	templateUrl: '/modules/admin/content/views/viewContent.html',
		               	controller : 'ContentController'
		        })
		        .state('addFaq', {
						url: '/addFaq/',
		               	templateUrl: '/modules/admin/faq/views/addFaq.html',
		               	controller : 'FaqController'
		        })
		        .state('manageFaq', {
						url: '/manageFaq/',
		               	templateUrl: '/modules/admin/faq/views/manageFaq.html',
		               	controller : 'FaqController'
		        })
		        .state('editFaq', {
						url: '/editFaq/:faqId',
		               	templateUrl: '/modules/admin/faq/views/editFaq.html',
		               	controller : 'FaqController'
		        })
		        .state('viewFaq', {
						url: '/viewFaq/:faqId/:action',
		               	templateUrl: '/modules/admin/faq/views/viewFaq.html',
		               	controller : 'FaqController'
		        })
		         .state('changePassword', {
						url: '/changePassword/',
		               	templateUrl: '/modules/admin/authentication/views/changePassword.html',
		               	controller : 'loginController'
		        })
	$urlRouterProvider.otherwise("/");
}])
// .factory('httpInterceptor', function ($q, $rootScope, $log) {

//     var numLoadings = 0;

//     return {
//         request: function (config) {

//             numLoadings++;

//             // Show loader
//             $rootScope.$broadcast("loader_show");
//             return config || $q.when(config)

//         },
//         response: function (response) {

//             if ((--numLoadings) === 0) {
//                 // Hide loader
//                 $rootScope.$broadcast("loader_hide");
//             }

//             return response || $q.when(response);

//         },
//         responseError: function (response) {

//             if (!(--numLoadings)) {
//                 // Hide loader
//                 $rootScope.$broadcast("loader_hide");
//             }

//             return $q.reject(response);
//         }
//     };
// })
// .config(function ($httpProvider) {
//     $httpProvider.interceptors.push('httpInterceptor');
// })
// .directive('loading',   ['$http' ,function ($http)
//     {
//         return {
//             restrict: 'A',
//             link: function (scope,elm,attrs)
//             {
//                 scope.isLoading = function () {
//                     return $http.pendingRequests.length > 0;
//                 };
  
//                 scope.$watch(scope.isLoading, function (v)
//                 {
//                     if(v){
//                         elm.show();
//                     }else{
//                         elm.hide();
//                     }
//                 });
//             }
//         };
  
//     }])
