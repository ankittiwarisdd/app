const Url ={ "baseUrl":""};
const messages = {
	"invalidemail":"Please enter valid email address.",
	"errorRetreivingData": "No record found",
	"successRetreivingData": "Records found",
	"errorRetreivingPassword": "Please enter correct old password",
    "userPasswordUpdate":"Password Changed Successfully",
	"userPasswordUpdateFailure":"Password not changed,Please try again",
	"PasswordRequired":"Please Enter Old Password",        
	"errorVerification" : "Verification token is invalid or expired",
	"successVerification" : "Account verification successfully done",
	"ImageUploadError":"Image not uploaded due to some reason",
	"ImageExtension":"Only jpeg and jpg images are allowed",

	//forgot password
	"successSendingForgotPasswordEmail": "Please check your email id to reset the password",
	"successSendingForgotPasswordRest": "Password has been changed successfully.",
	"successSendingForgotPasswordEmailCon": "Password has been sent to your email",



	//category messages
	"categoryAddFailure": "Unable to add the category, please try again",
	"categoryAddSuccess": "Category added successfully",
	"categoryDeleteFailure": "Unable to delete the category, please try again",
	"categoryDeleteSuccess": "Category deleted successfully",
	"categoryStatusUpdateFailure":"Unable to update status of category, please try again",
	"categoryStatusUpdateSuccess":"Category status updated successfully",
	"categoryUpdateFailure":"Unable to update category, please try again",
	"categoryUpdateSuccess":"Category updated successfully",

	//sub-category messages
	"subCategoryDeleteFailure": "Unable to delete the sub-category, please try again",
	"subCategoryDeleteSuccess": "Sub-category deleted successfully",
	"subCategoryStatusUpdateFailure":"Unable to update status of sub-category, please try again",
	"subCategoryStatusUpdateSuccess":"Sub-category status updated successfully",
	"subCategoryUpdateFailure":"Unable to update sub-category, please try again",
	"subCategoryUpdateSuccess":"Sub-category updated successfully",
     
    //emailTemplate messages   
    "emailTemplatesSuccess" : "Email templates saved successfully",
    "emailTemplatesFailure" : "Error occurred while saving data",
    "emailTemplateUpdateSuccess" : "Template updated successfully",
    "emailTemplateDeleteSuccess": "Template(s) deleted successfully",
    "emailTemplatesDeleteFailure" : "Error occurred while deleting the template",
    "emailTemplateActivateSuccess" : "Template(s) activated successfully",
    "emailTemplateActivateFailure" : "Error occurred while activating the template",
    "emailTemplateDeActivateSuccess" : "Template(s) deactivated successfully",
    "emailTemplateDeActivateFailure" : "Error occurred while deactivating the template",

    //merchant messages   
    "merchantSuccess": "Please check your email for account activation",
    "merchantPasswordResetToken":"Password reset token has expired.",
    "merchantPasswordSuccess":"Password reset token is valid",
    "merchantOldPasswordFailure" : "Old Password doesn't match with your current password",
    "merchantPasswordUpdateFailure" : "Wasn't able to update the password",
    "merchantPasswordUpdateSuccess" : "password updated successfully", 
    "merchantStatusUpdateFailure" : "Unable to update status, please try again",
    "merchantStatusUpdateSuccess" : "Status updated successfully",  

    //Consumer messages
    "consumerAddFailure": "Unable to add the consumer, please try again",
    "consumerAddSuccess": "Your registration is successful",
    "consumerEmailBlank": "Email is required",
    "consumerLoginFailure": "Either email or password is incorrect",
    "consumerLoginSuccess": "Login successful",
    "consumerEmailnotexist": "Email doesn't exist",
    "consumerUpdateFailure": "Unable to update your profile, please try again",
    "consumerUpdateSuccess": "Profile has been updated",

     //Favourite messages
    "favouriteSuccess": "Offer has been added as favourite",
    "favouriteFailure": "Unable to add offer as favourite",
    "removeFavouriteSuccess": "Offer has been removed as favourite",
    "removeFavouriteFailure": "Unable to remove offer from favourite",
    "favouriteExist": "Already added as favourite",

    //site-content messages
	"siteContentAddFailure":"Unable to add site content",
	"siteContentAddSuccess":"Site-content added successfully",
	"siteContentUpdateFailure":"Unable to update site-content, please try again",
	"siteContentUpdateSuccess":"site-content updated successfully",

	//site-content app messages
	"contentAddFailure":"Unable to add site content",
	"contentAddSuccess":"Site-content added successfully",
	"contentUpdateFailure":"Unable to update site-content, please try again",
	"contentUpdateSuccess":"site-content updated successfully",

	"messagePostFailed" : "Your message couldn't be sent to the Admin.",
	"messagePostSuccess" : "Your message to the Admin was sent successfully."
}

const gmailSMTPCredentials = {
    "type": "SMTP",
	"service": "Gmail",
	"host": "ssl://smtp.gmail.com",
	"username": "sdd.sdei@gmail.com",
	"password": "sdd#2001"
}


const facebookCredentials = {
	"app_id" : "1655859644662114", 
	"secret":"62da09d9663d9f8315e873abfdbbe70f",
	"token_secret": process.env.token_secret || 'JWT Token Secret'
}

const twitterCredentials = {
	"consumer_key" : "q2doqAf3TC6Znkc1XwLvfSD4m",
	"consumer_secret" : "Yrfi1hr84UMoamS2vnJZQn6CeP8dHsv6XjDoyRqsfzSNwyFQBZ"
}

const googleCredentials = {
	"client_secret_key" : "leWdLHJOoo9g6B9oLCV1lMqY"
}
const ImageSize = {
	"listSize" :226,
	"detailSize":360,
}

var obj = {ImageSize:ImageSize,messages:messages, gmailSMTPCredentials:gmailSMTPCredentials, facebookCredentials:facebookCredentials, twitterCredentials : twitterCredentials, googleCredentials : googleCredentials,Url:Url};
module.exports = obj;