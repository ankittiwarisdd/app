var baseUrl = "";
var webservices = {	
	"authenticate" : baseUrl + "/merchants/authenticate",
	"logout": baseUrl + "/merchants/logout",

	"findSubCategory": baseUrl + "/merchants/findSubCategory",	
	"getCountry": baseUrl + "/merchants/getCountry",
	"getCategoryList" : baseUrl + "/categories/listCategories",	
	"getSubCategoryList" : baseUrl + "/subcategories/listSubCategories",
	"getOfferTypeList" : baseUrl + "/offertypes/listOfferTypes",
	"saveOffer" : baseUrl + "/offers/saveOffer",
	"getOfferListMerchant" : baseUrl + "/offers/manageOffers",
	"editOffer" : baseUrl + "/offers/editOffer",
	"updateOffer" : baseUrl + "/offers/updateOffer",
	"deleteOffer" : baseUrl + "/offers/deleteOffer",
	"statusOffer" : baseUrl + "/offers/statusOffer",
	"editMerchant" : baseUrl + "/merchants/editMerchant",
	"updateMerchant" : baseUrl + "/merchants/updateMerchant",
	"changePassword" : baseUrl + "/merchants/changePassword",
	"getDashCount" : baseUrl + "/merchants/getDashCount",
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