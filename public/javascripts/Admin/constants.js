var baseUrl = "";
var webservices = {	
	"authenticate" : baseUrl + "/adminlogin/authenticate",
	"logout": baseUrl + "/adminlogin/logout",
	"forgot_password": baseUrl + "/adminlogin/forgot_password",
	"resetAdminPassword": baseUrl + "/adminlogin/resetAdminPassword",

	"addCategory" : baseUrl + "/categories/addCategory",
	"getCategoryList" : baseUrl + "/categories/listCategories",
	"editCategory" : baseUrl + "/categories/editCategory",
	"updateCategory" : baseUrl + "/categories/updateCategory",
	"deleteCategory" : baseUrl + "/categories/deleteCategory",
	"statusCategory" : baseUrl + "/categories/statusCategory",

	"addSubCategory" : baseUrl + "/subcategories/addSubCategory",
	"getSubCategoryList" : baseUrl + "/subcategories/listSubCategories",
	"editSubCategory" : baseUrl + "/subcategories/editSubCategory",
	"updateSubCategory" : baseUrl + "/subcategories/updateSubCategory",
	"deleteSubCategory" : baseUrl + "/subcategories/deleteSubCategory",
	"statusSubCategory" : baseUrl + "/subcategories/statusSubCategory",

	"addMerchant" : baseUrl + "/merchants/addMerchant",
	"getMerchantList" : baseUrl + "/merchants/listMerchants",
	"editMerchant" : baseUrl + "/merchants/editMerchant",
	"updateMerchant" : baseUrl + "/merchants/updateMerchant",
	"deleteMerchant" : baseUrl + "/merchants/deleteMerchant",
	"statusMerchant" : baseUrl + "/merchants/statusMerchant",

	"addOfferType" : baseUrl + "/offertypes/addOfferType",
	"getOfferTypeList" : baseUrl + "/offertypes/listOfferTypes",
	"editOfferType" : baseUrl + "/offertypes/editOfferType",
	"updateOfferType" : baseUrl + "/offertypes/updateOfferType",
	"deleteOfferType" : baseUrl + "/offertypes/deleteOfferType",
	"statusOfferType" : baseUrl + "/offertypes/statusOfferType",

	"addSiteContent" : baseUrl + "/sitecontents/addSiteContent",
	"getSiteContentList" : baseUrl + "/sitecontents/listSiteContents",
	"editSiteContent" : baseUrl + "/sitecontents/editSiteContent",
	"viewSiteContent" : baseUrl + "/sitecontents/viewSiteContent",
	"updateSiteContent" : baseUrl + "/sitecontents/updateSiteContent",

	"addContent" : baseUrl + "/contents/addContent",
	"getContentList" : baseUrl + "/contents/listContents",
	"editContent" : baseUrl + "/contents/editContent",
	"viewContent" : baseUrl + "/contents/viewContent",
	"updateContent" : baseUrl + "/contents/updateContent",

	"addFaq" : baseUrl + "/faqs/addFaq",
	"getFaqList" : baseUrl + "/faqs/listFaqs",
	"editFaq" : baseUrl + "/faqs/editFaq",
	"viewFaq" : baseUrl + "/faqs/viewFaq",
	"updateFaq" : baseUrl + "/faqs/updateFaq",
	"changePassword"    :baseUrl + "/adminlogin/changePassword",
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