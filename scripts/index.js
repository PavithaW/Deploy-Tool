var encrypted;
var y;
var login_email;
var login_pin;
var loginJson;
var response;
var responseText;
var onlineRegisData;
var params;
var isStore;
var isJsonUploaded;

$(document).ready(function(){

	$("#submitBtn").click(function() {

		regisData();
		
	});
	
	$("#loginBtn").click(function() {

		login();
		
	});
	
	$("#editText").click(function() {

	enableTextFields();
		
	});

    $("#onlineRegister").click(function(){
        showLogin();
    });
    
    $("#registerButton").click(function(){
        closeLogin();
        document.getElementById('pp_email').disabled = true;
        document.getElementById('pp_storeName').disabled = true;
        document.getElementById('pp_zipcode').disabled = true;
        document.getElementById('pp_country').disabled = true;
        document.getElementById('pp_country_name').disabled = true;
        document.getElementById('pp_retailer').disabled = true;
        $(".loginFormInnerHolder .formBody #form .formInput input").val("");
		    $("#selectRetailer").val("");
    });

    $(".menuButtons").click(function(){
      $(".formWrapper").fadeOut(500);
      $(".menuButtons").removeClass("buttonSelected");
      $(this).addClass("buttonSelected");
      $("."+this.id).fadeIn(500);
      closeLogin();
    });
    
});

function showLogin(){

  $(".loginFormWrapper").fadeIn(500,function(){});
  $(".loader").css('display','none');
}

function closeLogin(){

    $(".loginFormWrapper").fadeOut(500, function(){
        $(".editProfileinner").css("visibility","visible");
    });
    
    // $(".uploadJson").css('visibility','hidden');
    
}

function onlineRegister(){

	var contact_email = document.getElementById("pp_email").value;
	//var password = document.getElementById('pp_pswd').value;
	var zipCode = document.getElementById('pp_zipcode').value;
	//var retailer = document.getElementById('selectRetailer').options[document.getElementById('selectRetailer').selectedIndex].value;
	var retailer = document.getElementById('pp_retailer').value;
	var store = document.getElementById('pp_storeName').value;
	var displayCountry = document.getElementById('pp_country').value;
	var country = document.getElementById('pp_country_name').value;
	var deviceName = document.getElementById('pp_device').value;
	var isPortrait = document.querySelector('input[name="pp_portrait"]:checked').value;
	
	console.log(retailer);

	
	var tag = $('#regisTags').tagit('assignedTags');
	//var encryptedPassword = hex_md5(password);

	y = document.getElementById("toastMsg1")
	
    if(contact_email == ''){
    
    y.innerHTML = "Contact email can not be empty";	
    y.className = "show";
    setTimeout(function(){ y.className = y.className.replace("show", ""); }, 3000);
   
    return '';
    
    }
    else if(zipCode == ""){
	
    y.innerHTML = "Post Code can not be empty";	
    y.className = "show";
    setTimeout(function(){ y.className = y.className.replace("show", ""); }, 3000);
    
	return '';
	
    }
    else if(retailer == ""){
	
    y.innerHTML = "Retailer Name can not be empty";	
    y.className = "show";
    setTimeout(function(){ y.className = y.className.replace("show", ""); }, 3000);
    
	return '';
	
    }
    else if(store == ""){
	
    y.innerHTML = "Store Name can not be empty";	
    y.className = "show";
    setTimeout(function(){ y.className = y.className.replace("show", ""); }, 3000);
    
	return '';
	
    }
    
	else{
    if(tag == ""){
    
    	tag = '[]';
    	
    }
    if(deviceName == ""){
    
  		deviceName = "default";
    }
    
    onlineRegisData = new Object();
    
   // if(!isStore){
    
	onlineRegisData.contactEmail = contact_email;
	//onlineRegisData.password = encryptedPassword;
	onlineRegisData.postcode = zipCode;
	onlineRegisData.retailerName = retailer;
	onlineRegisData.storeId = store;
	onlineRegisData.display_country_name = displayCountry;
	onlineRegisData.country = country;
	onlineRegisData.deviceName = deviceName ;
	onlineRegisData.tags = tag;
 	onlineRegisData.isPortrait = isPortrait;
 	
//  	}
//  	else{
//  		onlineRegisData.contactEmail = contact_email;
//  		//onlineRegisData.password = encryptedPassword;
//  		onlineRegisData.deviceName = deviceName ;
// 		onlineRegisData.tags = tag;
//  		onlineRegisData.isPortrait = isPortrait;
//  	}

	params = new Object();
	params.method = 'registration';
	params.args = onlineRegisData;
	
	params = JSON.stringify(params);
	
	console.log(params);
    
    y.innerHTML = "Registered!";  
    y.className = "show";
    setTimeout(function(){ y.className = y.className.replace("show", ""); }, 3000);

    return params;
    
    }
    
}

$(function(){
        
            $('#regisTags').tagit();
            $('.tagit-new').unbind('keyup').keyup(function() {

            var tagVal = $('.tagit-new input').val();
            if (/^[a-zA-Z0-9._()]*$/.test(tagVal) == false ){
            $('.tagit-new input').val(tagVal.substring(0,tagVal.length-1));
             }
            });
            
});

        
function displayingProgress(stateText){

	$('.progress_state').fadeIn(0);
    $(".progress_state").css("visibility","visible");
    $(".progressText").html(stateText);
    $(".dots").css("visibility","visible");
}


function removeProgress(stateText){

    $(".progressText").html(stateText);
    $('.progress_state').delay(2000).fadeOut(0);
    $(".dots").css("visibility","hidden");
}

function addToFields(mail,devicename,tags,isPortrait,storeName,displayCountry,country,postCode, retailer){

      	if(isJsonUploaded){
    
      		isJsonUploaded = false;
      		showLogin();
      
      	}
    	else{
      		var y = document.getElementById("toastMsg")
			y.innerHTML = "Please upload a json file";	
    		y.className = "show";
    		setTimeout(function(){ y.className = y.className.replace("show", ""); }, 3000);
    	
      }

	document.getElementById("pp_email").value = mail;
	document.getElementById("pp_device").value = devicename;
	document.getElementById('pp_zipcode').value = postCode;
	document.getElementById('pp_storeName').value = storeName;
	document.getElementById('pp_country').value = displayCountry;
	document.getElementById('pp_country_name').value =country;
	document.getElementById('pp_retailer').value = retailer;

$('#selectRetailer').append('<option value=' + retailer + '>' + retailer + '</option>');
$('#selectRetailer').val(retailer);
    	
	
	
	$('#regisTags').tagit("removeAll");
	
	if ( tags != null ) {	
    	 for (var index = 0; index <tags.length; index++) {
         $('#regisTags').append('<li class="tagit-choice ui-widget-content ui-state-default ui-corner-all tagit-choice-editable"><span class="tagit-label">'+tags[index]+'</span><a class="tagit-close"><span class="text-icon">×</span><span class="ui-icon ui-icon-close"></span></a><input type="hidden" value="'+tags[index]+'" name="tags" class="tagit-hidden-field"></li>');
 
     }
     


}


   if(isPortrait == true){
    	document.getElementById("port").checked=true;	
    }else{
    	document.getElementById("land").checked=true;
    }

}

function login(){

    $(".loader").css('display','inline-block');
	login_email = document.getElementById("lemail").value;
	login_pin = document.getElementById("lpin").value;
	
	loginJson = new Object(); 
	loginJson.clientEmail = login_email;
	loginJson.clientPin = login_pin;

	
	loginJson =JSON.stringify(loginJson);
    editProfileShow();
    var url = "https://apipub.multplx.com/check/pin.py?json="+loginJson;
    console.log(url);
	
	var xhr = createCORSRequest('GET', url);
	
	if (!xhr) {
	console.log('error');
  	throw new Error('CORS not supported');
	}
	
  	xhr.onload = function() {
  	
    response = xhr.responseText;
    console.log('Response::' + response);
    
    var isValid = JSON.parse(response).accept;
    if(isValid){
    
    var email = JSON.parse(response).contactEmail;
    var store = JSON.parse(response).last_registered_device_profile;
    var countryKey = JSON.parse(response).countries.default;
    var country;
    
    $.each(JSON.parse(response).countries, function(key, obj) {
	if(key == countryKey){
	console.log(key);
	country = obj.displayName;
	}
                 
    });
    
    isStore = JSON.parse(response).registrar_is_store;

	document.getElementById("pp_email").value = email;
	document.getElementById("pp_storeName").value = store.storeId;
	document.getElementById("pp_country").value = country;
	document.getElementById("pp_country_name").value = store.country;
	document.getElementById("pp_zipcode").value = store.postcode;
	//document.getElementById("pp_retailer").value = store.retailerName;
	
	

	
		showLogin();
  	$(".uploadJson").css('visibility','visible');
  	
 	var select = document.getElementById("selectRetailer"); 
 	var retailerList = JSON.parse(response).retailer; 
 	var retailer= [];

 	$.each(retailerList, function(key, obj) {

           retailer.push(key);

    });

    $( "#pp_retailer" ).autocomplete({
      source: retailer
    });
    
    
    /*drop down list of retailer*/

// 	for(var i = 0; i < retailer.length; i++) {
//     	var opt = retailer[i];
//     	var el = document.createElement("option");
//     	el.textContent = opt;
//     	el.value = opt;
//     	select.appendChild(el);
//     	if(retailer[i] == store.retailerName ){
//     	//opt.selected = true;
//     	console.log(opt);
//     	$('#selectRetailer').val(opt);
//     	}
//     
// 	}
	
	}else{
	
	y = document.getElementById("toastMsg");
	y.innerHTML = "Enter Correct e-mail and Pin";	
    y.className = "show";
    $(".loader").css('display','none');
    setTimeout(function(){ y.className = y.className.replace("show", ""); }, 2000);
	}

  };

  xhr.onerror = function() {
   console.log('Woops, there was an error making the request.');
  };

  xhr.send();
  
}


function createCORSRequest(method, url) {

  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    xhr.open(method, url, true);

  } else if (typeof XDomainRequest != "undefined") {

    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {
    xhr = null;

  }
  
  return xhr;
}


function editProfileShow(){
    $(".editProfileinner").css("visibility","visible");
}


function enableTextFields(){

	document.getElementById('pp_storeName').disabled = false;
	document.getElementById('pp_zipcode').disabled = false;
	document.getElementById('pp_email').disabled = false;
	document.getElementById('pp_retailer').disabled = false;
}
	