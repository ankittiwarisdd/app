var baseUrl = "";
var webservices = {	
	"home" : baseUrl + "/home",
	"registerMerchant" : baseUrl + "/merchants/registerMerchant",
	"authenticate" : baseUrl + "/merchants/authenticate",
	"logout": baseUrl + "/merchants/logout",
	"forgot_password": baseUrl + "/merchants/forgot_password",
	"resetMerchantPassword": baseUrl + "/merchants/resetMerchantPassword",	
	"findSubCategory": baseUrl + "/merchants/findSubCategory",
	
	"getFrontCountry": baseUrl + "/merchants/getFrontCountry",

	"getCategoryList" : baseUrl + "/categories/listCategories",	
	"getSubCategoryList" : baseUrl + "/subcategories/listSubCategories",
	"getOfferTypeList" : baseUrl + "/offertypes/listOfferTypes",

	"saveOffer" : baseUrl + "/offers/saveOffer",
	"getSubCat" :baseUrl + "/getSubCat",
	"getOffer"  :baseUrl + "/getOffer",
	"sendSmeMessage" : baseUrl + "/sendSmeMessage"
}

var facebookConstants = {
	"facebook_app_id": "1655859644662114"
}

var googleConstants = {

	"google_client_id" : "54372597586-09u72notkj8g82vl3jt77h7cbutvr7ep.apps.googleusercontent.com",
	
}

var appConstants = {
	"authorizationKey": "b2ZmdXo6b2ZmdXo="	
}


var headerConstants = {
	"json": "application/json,multipart/form-data",
	"transformRequest": "angular.identity",
	"transformRequest": angular.identity,
    "headers": {'Content-Type': false}
}

var pagingConstants = {
	"defaultPageSize": 10,
	"defaultPageNumber":1
}