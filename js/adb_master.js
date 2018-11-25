var isJsonUploaded;
var selecteddeviceId;
var currentPort = 9744;
var currentConn = null;
var remoteControlObj;
var deviceList;
var registerObject;
var isRegisteredToStore;
var stateObject;
var applicationObject;
var formattedDate;
var formattedTime;
var isStore = false;
var isDeviceClicked = false;
var isUnregistered = false;
var isUnknownUser = false;
var remoteControlforClone;
var temProfileObj;
var isMenuClicked = false;
var connectedtoFirst = false;
var isMyPlayerRestarting = false;
var connectedWifiObject;
var connectdSsid;
var isOnline;
var selectedCampaignId;
var wifiArray;
var ipc;
var isAlertOpened;
var isAssigned;
var isEthernet;
var myPlayerVersion;
var isValidResponse = false;
var istalledAppJson;
var installedAppArray;
var appDetailArray;
//var isApplicationClicked = false;

$(document).ready(function(){

	$(".deviceStateLoader").addClass("deviceStateLoaderShow");
	listDevices();
  	$('#settings_timefrom').ptTimeSelect();
  	$('#settings_timeto').ptTimeSelect();
  	$('#rg_settings_timefrom').ptTimeSelect();
   	$('#rg_settings_timeto').ptTimeSelect();
  	hideMenuScreens();
  	$(".menuButtons").removeClass("buttonSelected");
 	$(".wifiConnection").fadeOut(500);
 	
 	//document.getElementById("playListButton").style.visibility = "hidden";
 	
  	ipc = require('electron').ipcRenderer;
  	
  	ipc.on('information-dialog-selection', function (event, index) {
	
		console.log('HIT:');
		isAlertOpened = false;
  		let message = 'You selected '
  		if (index === 1) {
  			message += 'yes.'
  			
  			//$("#"+selectedCampaignId).addClass('listcampaign_selected'); 
  			playlistItemClick();
  		}
  		else {
  			message += 'no.'
  			console.log('message:'+ message);
  			//$("#"+selectedCampaignId).addClass("listcampaign");
  			$("#"+selectedCampaignId).removeClass("listcampaign_selected");
  			
  			
  			
  			
  		if ($("#"+selectedCampaignId).hasClass("listcampaign_selected")){
     		 $("#"+selectedCampaignId).removeClass("listcampaign_selected");
 		}else{
		//$(this).toggleClass("listcampaign_selected");
			$("#"+selectedCampaignId).addClass("listcampaign_selected");
		}

  			
  		}
  		
	})
  	
});

$("#refreshButton").click(function(){

	$("#connectedDeviceList").empty();
	$(".settingsformBody").hide();
	$(".formWrapper").fadeOut(500);
	hideDeviceProfile();
    hideDeviceState();
	$(".menuButtons").removeClass("buttonSelected");
	listDevices();
	isUnregistered = false;
	var y = document.getElementById("toastMsg6");
    y.innerHTML = "";
    y.className = "show"; 
	setTimeout(function(){ y.className = y.className.replace("show", ""); }, 1);
	
	document.getElementById('complete_state').innerHTML = "";
    document.getElementById('wifiNetwork').innerHTML = "";
    document.getElementById('myPlayerVersion').innerHTML = "";
    document.getElementById('devId').innerHTML = "";
    //isApplicationClicked = false;
    
});

$("#wifiNetwork").click(function(){
	console.log('clicked');
	$(".formWrapper").fadeOut(500);	
	$(".deviceSettingsDetailWrapper").fadeOut(500);	
	$(".wifiConnection").fadeIn(500);
	
});

$(".menuButtons").click(function(){

  
    if(deviceList.length !=0 ||(deviceList.length == 0 && this.id == 'installPackage')){
	$(".deviceStateLoader").addClass("deviceStateLoaderShow");
	hideDeviceProfile();
    hideDeviceState();

    $(".formWrapper").fadeOut(500);
    $(".menuButtons").removeClass("buttonSelected");
  
  	if(this.id == 'installPackage'){
  		$("."+this.id).fadeIn(500);
  	}else{
  
  		if(isValidResponse){
    		$("."+this.id).fadeIn(500);
    	}else{
    		document.getElementById('deviceStateMessagefield').innerHTML = "Data could not be loaded..";
			$('#deviceStateMessagefield').fadeIn();
			$(".deviceSettingsDetailWrapper").fadeIn(100);
			$("#deviceStateMessagefield").show();
			$("#editSettings").fadeOut(0);
    	}
    }
    closeLogin();
    closeRegisterSetting();
    $(".deviceStateLoader").removeClass("deviceStateLoaderShow");
    document.getElementById('complete_state').innerHTML = "";
    isMenuClicked = true; 
    }
        
});

$("#appInstallBtn").click(function(){
		
	$('input:checkbox[name=apps]:checked').each(function() {

  		var value = $(this).val();
  		var folderName = value;
  		var checkBoxId = $(this).attr('id');
  		
  		console.log('INSTALL VALUE:'+value);
  
  		$.each( applicationObject, function( key, value ) {
  		
  		if(value.name == folderName){
  		
  			console.log('apkName:'+value.apkName);
  			apkName = value.apkName;
  			packagename = value.package;
  			
  			installAppOnDevice(selecteddeviceId,folderName,apkName,packagename,checkBoxId);
  		}
  	
  	});

 });
 
});


$("#appUninstallBtn").click(function(){


	$('input:checkbox[name=uninstallApps]:checked').each(function() {

	var packageName = $(this).val();
	var appName = $(this).attr("data-appName")
	
	console.log('UNINSTALL packages:'+packageName);
	
	//console.log('Uninstall Clicked!!::packageName:'+packageName+':appName:'+appName);

	unInstallApp(selecteddeviceId,packageName,appName);

 });
 
});
   

$('#installApkButton').click(function() {

	console.log('deviceList.length::'+deviceList.length);

	if(deviceList.length != 0){
		selectApkToInstall(selecteddeviceId);
		isMenuClicked = true;
		connectedtoFirst = false;
	}

});

$('#browseForZipButton').click(function() {

	selectFileToSideload(selecteddeviceId);
	if(!isDeviceClicked) {
    	startPeerServer(currentPort, selecteddeviceId);	
    	isDeviceClicked = true;
    }
    isMenuClicked = true;
    connectedtoFirst = false;

});

$('#uploadJsonButton').click(function() {

	selectJsonToRead();

});

$("#loginBtn").click(function() {

	login();
		
});

$("#editText").click(function() {

	$(this).toggleClass("editButton_selected");     		
    if ($(this).hasClass("editButton_selected")){		
      enableTextFields(); 
      $(".tagit-close").find(".text-icon").html("×");	
      enable_rsp();	
    }
    else{    		
      disableTextFields();
      $(".tagit-close").find(".text-icon").html("");	
      disable_rsp();   		
  	} 
		
});

function disable_rsp(){
  $(".onoffswitch_rsp input").attr("disabled", true);   
  $("#rg_twentyFourSevenlb").css('pointer-events','none');   
  $(".play_date_time").css('pointer-events','none');    
  document.getElementById('rg_settings_timefrom').disabled = true;   
  document.getElementById('rg_settings_timeto').disabled = true;   
  $(".onoffswitch_rsp").css('opacity','0.5');   
}

function enable_rsp(){
  $(".onoffswitch_rsp input").attr("disabled", false);   
  $("#rg_twentyFourSevenlb").css('pointer-events','auto');   
  $(".play_date_time").css('pointer-events','auto');    
  document.getElementById('rg_settings_timefrom').disabled = false;   
  document.getElementById('rg_settings_timeto').disabled = false;   
  $(".onoffswitch_rsp").css('opacity','1');   
}

$("#onlineRegister").click(function(){
    showLogin();
});
    
$("#registerButton").click(function(){

	if(deviceList.length != 0){
    	closeLogin();
    	closeRegisterSetting();
    
    	isMenuClicked = true;
    	connectedtoFirst = false;
    
    	if(!isDeviceClicked) {
    		startPeerServer(currentPort, selecteddeviceId);	
    		isDeviceClicked = true;
    	}
    	
    	console.log('REGISTER BUTTON CLICKED:: isOnline:'+isOnline+' isEthernet:'+isEthernet);
    	
    	if(isOnline == undefined || isEthernet == undefined){
    		$(".wifiConnection").fadeOut(500);
			document.getElementById('deviceStateMessagefield').innerHTML = "Data could not be loaded..";
			$('#deviceStateMessagefield').fadeIn();
			$(".deviceSettingsDetailWrapper").fadeIn(100);
			$("#deviceStateMessagefield").show();
			$("#editSettings").fadeOut(0);
    	}
    	else if(!isOnline && !isEthernet){
    		$(".wifiConnection").fadeIn(500);
    	}else{
    		$(".wifiConnection").fadeOut(500);
    	}
    
    	document.getElementById('pp_email').disabled = true;
    	document.getElementById('pp_device').disabled = true;
    	document.getElementById('pp_storeName').disabled = true;
    	document.getElementById('pp_zipcode').disabled = true;
    	document.getElementById('pp_country').disabled = true;
    	document.getElementById('pp_country_name').disabled = true;
    	document.getElementById("pp_retailer").disabled = true;
    	document.getElementsByClassName('radioBtn').disabled = true;
    	document.getElementById("land").disabled = true;
    	document.getElementById("port").disabled = true;
    	disableTags();
    	disable_rsp();
		$(".editButton").removeClass("editButton_selected");
    
    	$(".loginFormInnerHolder .formBody #form .formInput input").val("");
		$("#selectRetailer").val("");
		$('#regisTags').tagit("removeAll");
	
	}
	isJsonUploaded = false;
	
});

$("#registerBtn").click(function(){

    if(!isMyPlayerRestarting){
              
        registerDeviceOnline(selecteddeviceId);
		isDeviceClicked = false;
              	
    }else{
              
        var y = document.getElementById("toastMsg1");
    	y.innerHTML = "MyPlayer is restarting. Please try again later..";  
    	y.className = "show";
    	setTimeout(function(){ y.className = y.className.replace("show", ""); }, 3000);
    	startPeerServer(currentPort, selecteddeviceId);	

    }
    
});

$("#updateBtn").click(function(){

	getSettingsInfo();

});

$("#locatorUpdateBtn").click(function(){

	if(!isStore){
	
		getProfileData();

	}
});

$('#playMedia').click(function(){

    if (this.checked) {
      $("#editSettingsBlock_powersave").slideDown();
      $("#editSettingsBlock_twentyfourseven").slideDown();
	  $("#testDiv").slideDown();
	  
    }
    else{
    	
    	$("#editSettingsBlock_powersave").slideUp();
    	$("#editSettingsBlock_twentyfourseven").slideUp();
		$("#testDiv").slideUp();
    }
});

$('#twentyFourSeven').click(function(){

    if (this.checked) {
      	
    	$("#timeSetting").slideUp();
    	$("#editsettings_pt_message").html("Your Kiosk is set to play 24 hours.Please turn off 24/7 to customize.");
    }
    else{
    	$("#timeSetting").slideDown();
    	$("#editsettings_pt_message").html("Please select the time and days you wish to play media.");

    }
}); 

$('#rg_playMedia').click(function(){

    if (this.checked) {
      $("#rg_editSettingsBlock_powersave").slideDown();
      $("#rg_editSettingsBlock_twentyfourseven").slideDown();
	  $("#rg_testDiv").slideDown();
	  
    }
    else{
    	
    	$("#rg_editSettingsBlock_powersave").slideUp();
    	$("#rg_editSettingsBlock_twentyfourseven").slideUp();
		$("#rg_testDiv").slideUp();
    }
});

$('#rg_twentyFourSeven').click(function(){

    if (this.checked) {
      	
    	$("#rg_timeSetting").slideUp();
    	$("#rg_editsettings_pt_message").html("Your Kiosk is set to play 24 hours.Please turn off 24/7 to customize.");
    }
    else{
    	$("#rg_timeSetting").slideDown();
    	$("#rg_editsettings_pt_message").html("Please select the time and days you wish to play media.");

    }
}); 

$('#wifiButton').click(function(){

 	$(".wifiloader").css("display","inline-block");
	var network = document.getElementById('wifiId').value;
	var password = document.getElementById('wifiPassword').value;
	
	if(network == "" || password == "" ){
		$(".wifiloader").css("display","none");
		return;
	}else{
	
	var wifiObject = new Object();
	wifiObject.ssid = network.trim();
	wifiObject.passkey = password;
	
	console.log('network:'+network+'password:'+password);
	
	var msgObj = new Object();
	msgObj.method = 'network_connect';
	msgObj.args = wifiObject;

	connectTonetwork(msgObj);
	}
}); 

function connectTonetwork(wifiObj){

   if(wifiObj != ''){
   
   	//var obj_args = JSON.parse(wifiObj);
   	var obj_message = new Object();
   	obj_message.method = 'do_wifi_connect()';
   	obj_message.action = '';
   	obj_message.args = wifiObj;

   	var cmd = "am broadcast -a com.multplx.android.mxdevad.peer --es message '"+JSON.stringify(obj_message)+"'";
   	
   	console.log(cmd);

    shellCommand(selecteddeviceId,cmd);
   	//$(".wifiloader").css("display","none");
   	document.getElementById('wifiId').value = "";
	document.getElementById('wifiPassword').value = "";

	setTimeout(function(){ $(".wifiloader").css("display","none"); }, 20000);
   }
}

function hasDuplicates(deviceList) {
    var valuesSoFar = Object.create(null);
    
    for (var i = 0; i < deviceList.length; ++i) {
    
        var value = deviceList[i];
        
        if (value in valuesSoFar) {
            return true;
        }
        valuesSoFar[value] = true;
    }
    return false;
}

// function findDuplicate(array) {
//   var i,
//   len=array.length,
//   result = [],
//   obj = {}; 
//   
//   for (i=0; i<len; i++){
//   
//   obj[array[i]]=0;
//   
//   }
//   
//   for (i in obj) {
//   
//   result.push(i);
//   }
//   return result;
//   }


//DeviceList//
function listDevices() {

	var Promise = require('bluebird')
	var adb = require('adbkit')
	var client = adb.createClient()
	var deviceIdArray= [];

	client.listDevices()
  		.then(function(devices) {

	//console.log('devices::',devices);
	document.getElementById('deviceCount').innerHTML = devices.length;
	
	for(var i=0; i< devices.length; i++){
		var id = devices[i].id
	 	deviceIdArray.push(id);
	}
	var isDuplicateIdFound = hasDuplicates(deviceIdArray);
	
	deviceList = devices;
	console.log('devices::',devices);
	
 	//var isDuplicateIdFound = hasDuplicates(deviceList);
 	
	if(!isDuplicateIdFound){
 	
 	for(i=0;i<devices.length;i++){
    
    	$('<li id='+deviceList[i].id+' class = "deviceList" ><a href="#"> '+deviceList[i].id+'</a></li>' ).appendTo( "#connectedDeviceList" );
    
     }
     	
    connectedtoFirst = true;
         
    if(devices.length!=0){
    
    	selecteddeviceId = devices[0].id;
    	document.getElementById('devId').innerHTML = devices[0].id;
    	document.getElementById('devType').innerHTML = devices[0].type;
    	
    	startPeerServer(currentPort, selecteddeviceId); 
    	isDeviceClicked =false;
    	$("#"+selecteddeviceId).addClass("deviceList_selected");
    	$(".menuButtons").css("pointer-events","auto");
    	$(".menuButtons").removeClass("buttonSelected");

    }
    else{
    	$('<li class = "noDevice" ><a href="#"> '+'No Devices Found'+'</a></li>' ).appendTo( "#connectedDeviceList" );
		document.getElementById('devId').innerHTML ="";
    	document.getElementById('devType').innerHTML = "";
    	
    	$(".settingPanelFormWrapper #form .formInput input").val("");
	
    	$(".installPackage").fadeIn(500);
    	$(".menuButtons").css("pointer-events","none");
    	$("#installPackage").addClass("buttonSelected");
    	$(".deviceStateLoader").removeClass("deviceStateLoaderShow");
    	hideDeviceSettings();
    	
    }

    
    $(".deviceList").click(function(event){
    	isMenuClicked = false;
    	connectedtoFirst = false;
    	isDeviceClicked = true;
    	//isApplicationClicked = false;
    	
		document.getElementById('complete_state').innerHTML = "";
    	document.getElementById('wifiNetwork').innerHTML = "";
    	document.getElementById('myPlayerVersion').innerHTML = "";
    	document.getElementById('devId').innerHTML = "";
    	
    	
    	$(".deviceStateLoader").addClass("deviceStateLoaderShow");
    	$("#deviceStateMessagefield").hide();
    	$(".formWrapper").fadeOut(0);  		
    	hideMenuScreens();
  		hideDeviceState();
  		hideDeviceProfile();
  		
    	document.getElementById('devId').innerHTML = this.id;

     	$(".menuButtons").removeClass("buttonSelected");
     
    	$("#connectedDeviceList").find(".deviceList").removeClass("deviceList_selected");
    	$('#'+this.id).addClass("deviceList_selected");
    
    	selecteddeviceId = this.id;
    	var isStartServer = true;
    	isValidResponse = false;
    	
    	closeSocket(selecteddeviceId,currentPort, isStartServer);
    	setTimeout(function(){
    		if(!isValidResponse){
    			closeSocket(selecteddeviceId,currentPort, isStartServer);
    		}
    	},6000);
    	    
    	document.getElementById('sp_email').disabled = true;
    	document.getElementById('sp_device').disabled = true;
    	document.getElementById('sp_retailer').disabled = true;
    	document.getElementById('sp_storeName').disabled = true;
    	document.getElementById('sp_zipcode').disabled = true;
    	document.getElementById('sp_country').disabled = true;
    	document.getElementById('sp_country_name').disabled = true;
    	document.getElementById("sp_land").disabled = true;
  		document.getElementById("sp_port").disabled = true;
    	$(".onoffswitch input").attr("disabled", true);
    	$("#twentyFourSevenlb").css('pointer-events','none');
    	$(".play_date_time").css('pointer-events','none');
    	document.getElementById('settings_timefrom').disabled = true;
    	document.getElementById('settings_timeto').disabled = true;
    	disableTags();
    	//getPlayList();

  });
  
	$("#twentyFourSevenlb").click(function(){
  
  		var twseven = $('#twentyFourSeven').prop('checked');
  
  		if(twseven == true){
  
    		$("#timeSetting").slideDown();
    		$("#editsettings_pt_message").html("Please select the time and days you wish to play media.");
  		}
  		else{
    		$("#timeSetting").slideUp();
    		$("#editsettings_pt_message").html("Your Kiosk is set to play 24 hours.Please turn off 24/7 to customize.");
  		}
	});


	$(".play_date_time").unbind('click').bind('click' ,function(){

    	$(this).toggleClass("play_date_timeSelected");
    
	});
  
	$("#editSettings").unbind('click').bind('click' ,function(){
  		$(this).toggleClass("editSettings_selected");
  			  
    	if ($(this).hasClass("editSettings_selected")){
    	
    	    if(!isDeviceClicked) {
    			startPeerServer(currentPort, selecteddeviceId);	
    			isDeviceClicked = true;
    			
    		}
    		isMenuClicked = true;
    		connectedtoFirst = false;
    		
    		hideDeviceState();
    		showDeviceProfile();

    		
    		
    		if(isStore == undefined){
      			var y = document.getElementById("toastMsg3")
				y.innerHTML = "User type can not be identified";	
    			y.className = "show";
    			setTimeout(function(){ y.className = y.className.replace("show", ""); }, 3000);
    			isStore = true;
    			isUnknownUser = false;
    		} 
      		enableSettingsFields();
      		$(".tagit-close").find(".text-icon").html("×");

    	}
    	else{		
      		disableSettingsFields();
      		hideDeviceProfile();
      		showDeviceState(true);
      		$(".tagit-close").find(".text-icon").html("");		
    	}	
	});
  		
    }
	else{
     	console.log('DUPLICATE FOUND::');
     	$('<li class = "noDevice" ><a href="#"> '+'This will not proceed until all serial numbers are distinct'+'</a></li>' ).appendTo( "#connectedDeviceList" );
     	$(".deviceStateLoader").removeClass("deviceStateLoaderShow");
    	document.getElementById('devId').innerHTML ="";
    	document.getElementById('devType').innerHTML = "";
    	$(".installPackage").fadeIn(500);
    	$(".menuButtons").css("pointer-events","none");
    	$("#installPackage").addClass("buttonSelected");
     }
    
    
    return devices;

   })
  .catch(function(err) {
    console.error('Something went wrong:', err.stack)

  })

}

$("#backToState").click(function(){	
	
  editSettingHide();
  		
});

$("#applicationsButton").click(function(){	

	//isApplicationClicked = true;
	//startPeerServer(currentPort, selecteddeviceId);
		
});			
 	
function hideMenuScreens() {
	
	$(".installPackage").fadeOut(0);
	$(".registerButton").fadeOut(0);
	$(".sideloadButton").fadeOut(0);
	$(".loginFormWrapper").fadeOut(0);
	
	  
}

function showDeviceState(isImmediate) {

	$(".deviceStateLoader").addClass("deviceStateLoaderShow"); 
	if(isImmediate) {
		$(".deviceSettingsDetailWrapper").fadeIn(500); 
  		$(".profileInfo").fadeIn(100,function(){
        		$(".deviceStateLoader").removeClass("deviceStateLoaderShow");
      	});
	}
	else {
		setTimeout(function(){ 
		
			$('#deviceStateMessagefield').fadeIn();
			$(".deviceSettingsDetailWrapper").fadeIn(100); 
			if(!isUnregistered){
  				$(".profileInfo").fadeIn(100,function(){
        			$(".deviceStateLoader").removeClass("deviceStateLoaderShow");
      			});
  			}
		}, 1000);
	}
  	$(".formWrapper").fadeOut(500);  
  	   	
}

function hideDeviceState() {
	
	$(".deviceSettingsDetailWrapper").fadeOut(0);
	$(".profileInfo").fadeOut(0);
  
}

function showDeviceProfile() {
	
	$(".deviceSettingsDetailWrapper").fadeIn(0);
	$("#editSettings").fadeIn(0);
  	$(".settingPanelFormWrapper").fadeIn(0);
  	
  	if(isStore){
  		$("#changelocator").slideUp();
  	}else{
  		$("#changelocator").slideDown();
  	}
  
}

function hideDeviceProfile() {
	
	$("#editSettings").removeClass("editSettings_selected");
	$(".deviceSettingsDetailWrapper").fadeOut(0);
	$(".settingPanelFormWrapper").fadeOut(0);
  
}

function editSettingShow(){

  $(".settingPanelFormWrapper").fadeIn(0);  
  $("#editSettings").fadeIn(0);   		
  $(".profileInfo").fadeOut(0);     		
  		
}	
	
function editSettingHide(){	
	
  $(".settingPanelFormWrapper").fadeOut(0);    		
  setTimeout(function(){ $(".profileInfo").fadeIn(500); }, 700);  		
  $("#editSettings").fadeIn(0);
  		
}

//install apk//

function selectApkToInstall(selectedId){

	const remote = require('electron').remote
	const dialog = remote.dialog


	dialog.showOpenDialog(function (fileNames) {
        
       if(fileNames === undefined){
            console.log("No file selected");
       }else{
            
            console.log(fileNames[0]);
            console.log(selectedId);
            
            installApk(selectedId,fileNames[0]);
       }
	});
}

function installApk(selectedId,apkPath) {

	var Promise = require('bluebird')
	var adb = require('adbkit')
	var client = adb.createClient()
	var apk = apkPath;
	
	console.log('APK:::'+apk);
	
	//displayingProgress('Installing');
	
	var y = document.getElementById("toastMsg5");
    y.innerHTML = "Installing...";  
    y.className = "show showSuccess";


	client.listDevices()
  	.then(function(devices) {
   	console.log('Step1::: %s ', apk)
   	
	//return client.install(selectedId, apk)
    return Promise.map(devices, function(device) {
    console.log('Step2::: %s ', apk)
      return client.install(selectedId, apk)
    })
  })
  .then(function() {
    console.log('Installed %s on selected device', apk)
    //removeProgress('Completed!');
    var y = document.getElementById("toastMsg5");
    y.innerHTML = "Installation Completed...";  
    y.className = "show showSuccess";
    setTimeout(function(){ y.className = y.className.replace("show", ""); }, 3000);

  })
  .catch(function(err) {
    console.error('Something went wrong:', err.stack)
    removeProgress('Error Occurred');
  })
}

function installAppOnDevice(selectedId,folderName,apkName,packageName,checkBoxId) {

	var Promise = require('bluebird')
	var adb = require('adbkit')
	var client = adb.createClient()
	var apk = '/sdcard/.multplx/applications/'+folderName+'/'+apkName;
	var copyapk = '/sdcard/.multplx/applications/'+folderName+'/'+'installApk.apk';

	
	var z = document.getElementById("toastMsgInstall");
    z.innerHTML = "Installing...";  
    z.className = "show showSuccess";
    //setTimeout(function(){ z.className = z.className.replace("show", ""); }, 40000);


	client.listDevices()
  	.then(function(devices) {
   	
    return Promise.map(devices, function(device) {
    
    	return client.shell(selectedId, 'cp '+apk+' '+copyapk)
    
      //return client.installRemote(selectedId, apk)
    })
  })
  .then(function() {
	return client.installRemote(selectedId, copyapk)
    
   })
    .then(function() {
    client.isInstalled(selectedId, packageName)
    
   .then(function(installed) {
   	
   	if(installed){
    console.log('Installed: ', installed)
    z.innerHTML = "Installed "+packageName;  
    z.className = "show showSuccess";
    setTimeout(function(){ z.className = z.className.replace("show", ""); }, 3000);
    
    var labelid= '#installedLabel'+folderName;
    var uninstallCheckbox = 'unInstallCheckbox'+folderName
    
    document.getElementById(checkBoxId).disabled = true;
    document.getElementById(uninstallCheckbox).disabled = false;
  	// document.getElementById("holder"+folderName).style.opacity = "0.4";
    document.getElementById("appIconHolder"+folderName).style.opacity = "1";
  	$('#'+uninstallCheckbox).attr('checked', false);
  	$('#'+checkBoxId).attr('checked', false);
  	$('#installCheckBoxHolder'+folderName).fadeOut(0);
  	$('#'+uninstallCheckbox).fadeIn(0);

  	
  	$(labelid).fadeIn(0);	
  	
  	}
    
  })
  .catch(function(err) {
    console.error('Something went wrong:', err.stack)
    z.innerHTML = "Something went wrong";  
    z.className = "show showSuccess";
    setTimeout(function(){ z.className = z.className.replace("show", ""); }, 3000);	
  })
    

  })
  .catch(function(err) {
    console.error('Something went wrong:', err.stack)
    removeProgress('Error Occurred');
    z.innerHTML = "Something went wrong";  
    z.className = "show showSuccess";
    setTimeout(function(){ z.className = z.className.replace("show", ""); }, 3000);	
  })
}

function unInstallApp(selecteddeviceId,packageName,appName){

	var Promise = require('bluebird')
	var adb = require('adbkit')
	var client = adb.createClient()
	var packageToUninstall = packageName;
	var selectedId;
	
	console.log('Package:::'+packageName);
	
	var z = document.getElementById("toastMsgInstall");
    z.innerHTML = "Uninstalling...";  
    z.className = "show showSuccess";
    setTimeout(function(){ z.className = z.className.replace("show", ""); }, 40000);

	var z = document.getElementById("toastMsgInstall");

	client.listDevices()
  	.then(function(devices) {
   	
    return Promise.map(devices, function(device) {
    	selectedId = device.id;
      	return client.uninstall(device.id, packageName)
    })
    .then(function() {
    client.isInstalled(selectedId, packageName)
   
   .then(function(installed) {
   	console.log('Package:::'+installed);
   	
   	if(!installed){
   	
    console.log('Uninstalled:')
    z.innerHTML = "Uninstalled "+packageName;  
    z.className = "show showSuccess";
    setTimeout(function(){ z.className = z.className.replace("show", ""); }, 3000);
    
    var labelid= 'installedLabel'+appName;
    var unInstallCheckbox = 'unInstallCheckbox'+ appName;
    var installCheckBox = 'checkbox'+appName;
    
    document.getElementById(unInstallCheckbox).disabled = true;
    document.getElementById(installCheckBox).disabled = false;
  	document.getElementById("appIconHolder"+appName).style.opacity = "0.4";
  	$('#'+unInstallCheckbox).fadeOut(0);
  	$('#installCheckBoxHolder'+appName).fadeIn(0);
  	$('#checkbox'+appName).attr('checked', false);
  	$('#'+unInstallCheckbox).attr('checked', false);
  	$('#'+labelid).fadeOut(0);
  	
  	}
    
  })
  .catch(function(err) {
    console.error('Something went wrong:', err.stack)
    z.innerHTML = "Something went wrong";  
    z.className = "show showSuccess";
    setTimeout(function(){ z.className = z.className.replace("show", ""); }, 3000);	
  })
    
    
  })
  .catch(function(err) {
    console.error('Something went wrong:', err.stack)
    z.innerHTML = "Something went wrong in uninstalling";  
    z.className = "show showSuccess";
    setTimeout(function(){ z.className = z.className.replace("show", ""); }, 3000);		
    //removeProgress('Error Occurred');
  })
})

}

//sideLoad//

function selectFileToSideload(selecteddeviceId){

	const remote = require('electron').remote
	const dialog = remote.dialog

	dialog.showOpenDialog(function (fileNames) {

       if(fileNames === undefined){
            console.log("No file selected");
       }else{
            console.log(fileNames[0]);
            
            doSideLoad(selecteddeviceId,fileNames[0]);

       }
	});
}


function doSideLoad(selecteddeviceId,filePath){

	var Promise = require('bluebird')
	var adb = require('adbkit')
	var client = adb.createClient()
	var fileName = filePath.replace(/^.*[\\\/]/, '');
	var packagePath = '/sdcard/Download/'+fileName;

	client.push(selecteddeviceId, filePath, packagePath)
	.then(function(transfer) {
          return new Promise(function(resolve, reject) {
            transfer.on('progress', function(stats) {
            
				//displayingProgress('Sideloading');
				var y = document.getElementById("toastMsg6");
    			y.innerHTML = "Sideloading...";  
    			y.className = "show showSuccess";
            })
            transfer.on('end', function() {
              console.log('[%s] Push complete', selecteddeviceId)
              
              if(!isMyPlayerRestarting){
              
              	sideloadZipFile(selecteddeviceId,packagePath);
              	
              }else{
              
            		var y = document.getElementById("toastMsg6");
    			y.innerHTML = "MyPlayer is restarting. Please try again later..";  
    			y.className = "show";
    			setTimeout(function(){ y.className = y.className.replace("show", ""); }, 3000);
    			startPeerServer(currentPort, selecteddeviceId);	

              }
              
              resolve()
            })
            transfer.on('error', reject)
          })
        })

  .then(function() {
    console.log('Done pushing'+ fileName)
  })
  .catch(function(err) {
    console.error('Something went wrong:', err.stack)
  })
}


function sideloadZipFile(selecteddeviceId,packagePath){

	var Promise = require('bluebird')
	var adb = require('adbkit')
	var client = adb.createClient()

 
   	var obj_message = new Object();
   	obj_message.method = 'do_sideload()';
   	obj_message.action = '';
   	obj_message.params = [packagePath];

   	var cmd = "am broadcast -a com.multplx.android.mxdevad.peer --es message '"+JSON.stringify(obj_message)+"'";

	client.shell(selecteddeviceId, cmd)
	.then(adb.util.readAll)
        .then(function(output) {
          console.log('[%s] %s', selecteddeviceId, output.toString().trim())
        })

  .then(function() {
    console.log('Done.')
    //removeProgress('Completed!');

  })
  .catch(function(err) {
    console.error('shellCommand:Something went wrong:', err.stack)
  })
	
}

//Read json file
function selectJsonToRead(){

	const remote = require('electron').remote
 	const dialog = remote.dialog
	dialog.showOpenDialog(function (fileNames) {
        // fileNames is an array that contains all the selected
       if(fileNames === undefined){
            console.log("No file selected");
       }else{
            console.log(fileNames[0]);
			readFile(fileNames[0]);
       }
	});
}

function readFile(fileToRead){

	fs = require('fs')
	fs.readFile(fileToRead, 'utf8', function (err,data) {
	
  		if (err) {
  			isJsonUploaded = false;
    		return console.log(err);
  		}
		else{

		 	isJsonUploaded = true;
  		 	var deviceProfile = JSON.parse(data).device_profile;
         	var user = JSON.parse(data).remote_control.user;
         	var storeName = JSON.parse(data).device_profile.storeId;
         	var displayCountry = deviceProfile.display_country_name;
         	var country = deviceProfile.country;
         	var postCode = JSON.parse(data).device_profile.postcode;
         	var retailer = JSON.parse(data).device_profile.retailerName;
         	isStore = JSON.parse(data).isStore;
         
		 	console.log(deviceProfile.contactEmail+'storeName:'+storeName+':displayCountry:'+displayCountry+':country:'+country+':postCode:'+postCode+'retailer:' + retailer+' isStore::'+isStore);
		 
        	var mail = deviceProfile.contactEmail;
 	    	var devicename = user.device_name;
 	    	var tagArray = JSON.parse(data).remote_control.restricted.tags;
         
         	var registrationMode = deviceProfile.registered_orientation;
         	var isPortrait;
         
         	if(registrationMode == 'SCREEN_ORIENTATION_LANDSCAPE'){
         		isPortrait = false;
         	}else{
         		isPortrait = true;
         	}
         	
         	console.log('user:::',user);
         	
         	var isWifiLockOn = user.wifiLockOn;
			var isLockScreenOn = user.lockScreen;
			var isplayMediaOn = user.presentationOn;
			var isPowerSaverOn = user.presentation.powerSave.enabled;
			var isWatchDogOn = user.presentation.listener;
			var isPlayTimeActive = user.presentation.playTime.playTimeActive;
			var isTwentyFourSeven;
			if(isPlayTimeActive){
			isTwentyFourSeven = false;
			}else{
			isTwentyFourSeven = true;
			}
			
			////////////////////////////////////////
			
			document.getElementById("rg_wifiLock").checked = isWifiLockOn;
			document.getElementById("rg_lockScreen").checked = isLockScreenOn;
			document.getElementById("rg_playMedia").checked = isplayMediaOn;
			document.getElementById("rg_powerServer").checked = isPowerSaverOn;
			document.getElementById("rg_watchdog").checked = isWatchDogOn;
			document.getElementById("rg_twentyFourSeven").checked = isTwentyFourSeven;
	

    		if (isplayMediaOn) {
      			$("#rg_editSettingsBlock_powersave").slideDown();
      			$("#rg_editSettingsBlock_twentyfourseven").slideDown();
      			$("#rg_testDiv").slideDown();
      
      
    		}else{
    			$("#rg_editSettingsBlock_powersave").slideUp();
    			$("#rg_editSettingsBlock_twentyfourseven").slideUp();
    			$("#rg_testDiv").slideUp();
    		}
    
    		var fromTime = '09:00';
    		var toTime = '18:00';
	
			if(!isTwentyFourSeven){
	
			$("#rg_timeSetting").slideDown();
    		$("#rg_editsettings_pt_message").html("Please select the time and days you wish to play media.");
	
	 		
		 	fromTime = user.presentation.playTime.from;
			toTime = user.presentation.playTime.to;
		
			var dateSelected = user.presentation.playTime;
		
			var isMonday = dateSelected.monday.presentationOn;
			var isTuesday = dateSelected.tuesday.presentationOn;
			var isWednesday = dateSelected.wednesday.presentationOn;
			var isThursday = dateSelected.thursday.presentationOn;
			var isFriday = dateSelected.friday.presentationOn;
			var isSaturday = dateSelected.saturday.presentationOn;
			var isSunday = dateSelected.sunday.presentationOn;



		$(".play_date_time").removeClass("play_date_timeSelected");
		
		if(isMonday){
    	$('#rg_ply_mon').addClass("play_date_timeSelected");
    	
    	}
    	if(isTuesday){
    		$('#rg_ply_tue').addClass("play_date_timeSelected");
    		
    	}
    	if(isWednesday){
    		$('#rg_ply_wed').addClass("play_date_timeSelected");

    	}
    	if(isThursday){
    		$('#rg_ply_thu').addClass("play_date_timeSelected");
    	}
    	
    	if(isFriday){
    		$('#rg_ply_fri').addClass("play_date_timeSelected");
    	}
    	
    	if(isSaturday){
    		$('#rg_ply_sat').addClass("play_date_timeSelected");
    	}
    	
    	if(isSunday){
    		$('#rg_ply_sun').addClass("play_date_timeSelected");
    	}

	}else{
    	  	
    	$("#rg_timeSetting").slideUp();
    	$("#rg_editsettings_pt_message").html("Your Kiosk is set to play 24 hours.Please turn off 24/7 to customize.");
    }
    
    	document.getElementById("rg_settings_timefrom").value = fromTime;
		document.getElementById("rg_settings_timeto").value =toTime ;

  
	$(".play_date_time").unbind('click').bind('click' ,function(){

    	$(this).toggleClass("play_date_timeSelected");
    
	});

        }

      	addToFields(mail,devicename,tagArray,isPortrait,storeName,displayCountry,country,postCode, retailer);
	});
		
}


function showLogin(){

  $(".loginFormWrapper").fadeIn(500,function(){
  $(".loader").css('display','none');
  
  });
}

function closeLogin(){

    $(".loginFormWrapper").fadeOut(500, function(){
        $(".editProfileinner").css("visibility","visible");
    });
    
}

function showRegisterSetting(){

  $(".registerSettingsPanel").fadeIn(500,function(){
  	//$(".registerSettingsPanel").css('display','none');

  });
}

function closeRegisterSetting(){

    $(".registerSettingsPanel").fadeOut(500, function(){
        //$(".registerSettingsPanel").css("visibility","visible");
    });
    
}

function addToFields(mail,devicename,tags,isPortrait,storeName,displayCountry,country,postCode, retailer){

    if(isJsonUploaded){
    
      	showLogin();
      	showRegisterSetting();
      
    }
    else{
      	var y = document.getElementById("toastMsg")
		y.innerHTML = "Please upload a json file";	
    	y.className = "show";
    	setTimeout(function(){ y.className = y.className.replace("show", ""); }, 3000);
    	
    }
    
    
	$('#pp_retailer').removeAttr( 'class' );
	
	document.getElementById("pp_email").value = mail;
	document.getElementById("pp_device").value = devicename;
	document.getElementById('pp_zipcode').value = postCode;
	document.getElementById('pp_storeName').value = storeName;
	document.getElementById('pp_country').value = displayCountry;
	document.getElementById('pp_country_name').value = country;
	document.getElementById('pp_retailer').value = retailer;

	$('#regisTags').tagit("removeAll");
	
	if ( tags != null ) {	

    	
     	for (var index = 0; index <tags.length; index++) {
         	
         	$('#regisTags').tagit('createTag', tags[index]);

 
     	}
     	
     	
     	$(".tagit-close").find(".text-icon").html("");
     	
     	disableTags();

	}


   if(isPortrait == true){
    	document.getElementById("port").checked=true;	
    }else{
    	document.getElementById("land").checked=true;
    }

}

function getRegisterSettings(){

	var wifiLock = document.getElementById("rg_wifiLock").checked;
	var lockScreen = document.getElementById("rg_lockScreen").checked;
	var playMedia = document.getElementById("rg_playMedia").checked;
	var powerSaver = document.getElementById("rg_powerServer").checked;
	var watchdog = document.getElementById("rg_watchdog").checked;
	var twentyFourSeven = document.getElementById("rg_twentyFourSeven").checked;
	var fromTime;
	var toTime;
		
		fromTime = document.getElementById("rg_settings_timefrom").value;
		toTime = document.getElementById("rg_settings_timeto").value;

	
	if(toTime < fromTime){
		var y = document.getElementById("toastMsg2");
		y.innerHTML = "To time is set to 00.00";	
    	y.className = "show";
    	$(".loader").css('display','none');
    	setTimeout(function(){ y.className = y.className.replace("show", ""); }, 2000);

	}
	
	var playTimeActive;
	if(twentyFourSeven){
		playTimeActive = false;
	}else{
		playTimeActive = true;
	}
	
	remoteControlforClone = new Object();
		
	remoteControlforClone.wifiLockOn = wifiLock;
	remoteControlforClone.lockScreen = lockScreen;
	remoteControlforClone.presentationOn = playMedia;
		
	var presentation = new Object();
		
	var powerSave = new Object();
	powerSave.enabled = powerSaver;
	presentation.powerSave = powerSave;
	presentation.listener = watchdog;
		
	var playTime = new Object();
	playTime.playTimeActive = playTimeActive;
		
	playTime.from = fromTime;
	playTime.to = toTime;
		
	presentation.playTime = playTime;
		
	remoteControlforClone.presentation = presentation;
// 	remoteControlforClone.device_name = devicename;
// 	remoteControlforClone.tags = tagArray;
	
	if($("#rg_ply_mon").hasClass( "play_date_timeSelected" )){
		var monday = new Object();
		monday.presentationOn = true;
		remoteControlforClone.presentation.playTime.monday = monday;
	}else{
		var monday = new Object();
		monday.presentationOn = false;
		remoteControlforClone.presentation.playTime.monday = monday;

		}
	if($("#rg_ply_tue").hasClass( "play_date_timeSelected" )){
	var tuesday = new Object();
		tuesday.presentationOn = true;
		remoteControlforClone.presentation.playTime.tuesday = tuesday;
	}else{
		var tuesday = new Object();
		tuesday.presentationOn = false;
		remoteControlforClone.presentation.playTime.tuesday = tuesday;
		}
	if($("#rg_ply_wed").hasClass( "play_date_timeSelected" )){
		var wednesday = new Object();
		wednesday.presentationOn = true;
		remoteControlforClone.presentation.playTime.wednesday = wednesday;
	}else{
		var wednesday = new Object();
		wednesday.presentationOn = false;
		remoteControlforClone.presentation.playTime.wednesday = wednesday;
		}
	if($("#rg_ply_thu").hasClass( "play_date_timeSelected" )){
		var thursday = new Object();
		thursday.presentationOn = true;
		remoteControlforClone.presentation.playTime.thursday = thursday;
	}else{
		var thursday = new Object();
		thursday.presentationOn = false;
		remoteControlforClone.presentation.playTime.thursday = thursday;
		}
	if($("#rg_ply_fri").hasClass( "play_date_timeSelected" )){
		var friday = new Object();
		friday.presentationOn = true;
		remoteControlforClone.presentation.playTime.friday = friday;
	}else{
		var friday = new Object();
		friday.presentationOn = false;
		remoteControlforClone.presentation.playTime.friday = friday;
		}
	if($("#rg_ply_sat").hasClass( "play_date_timeSelected" )){
		var saturday = new Object();
		saturday.presentationOn = true;
		remoteControlforClone.presentation.playTime.saturday = saturday;
	}else{
		var saturday = new Object();
		saturday.presentationOn = false;
		remoteControlforClone.presentation.playTime.saturday = saturday;
		}
	if($("#rg_ply_sun").hasClass( "play_date_timeSelected" )){
		var sunday = new Object();
		sunday.presentationOn = true;
		remoteControlforClone.presentation.playTime.sunday = sunday;
	}else{
		var sunday = new Object();
		sunday.presentationOn = false;
		remoteControlforClone.presentation.playTime.sunday = sunday;
		}
	
	return remoteControlforClone;
}


function login(){
    
	 $(".loader").css('display','inline-block');
	var login_email = document.getElementById("lemail").value;
	var login_pin = document.getElementById("lpin").value;
	
	var loginJson = new Object(); 
	loginJson.clientEmail = login_email.trim();
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
    //console.log('Response::' + response);
    
    var isValid = JSON.parse(response).accept;
    if(isValid){
    
    var email = JSON.parse(response).contactEmail;
    var store = JSON.parse(response).store;
    var lastRegistered = JSON.parse(response).last_registered_device_profile;
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
	document.getElementById("pp_country").value = country;
	document.getElementById("pp_country_name").value = countryKey;
	document.getElementById("land").checked = true;
	
	if(isStore){
	
		document.getElementById("pp_retailer").value = store.retailer_name;
		document.getElementById("pp_storeName").value = store.store_id;
		document.getElementById("pp_zipcode").value = store.postcode;
		
	}else{
	
		//document.getElementById("pp_retailer").disabled = false;
		
		if(lastRegistered.retailerName == undefined){
			//document.getElementById("pp_retailer").value = "";
			document.getElementById("pp_retailer").placeholder = "Enter a Retailer Name";
		}else{
			document.getElementById("pp_retailer").value = lastRegistered.retailerName;
		}
		if(lastRegistered.storeId == undefined){
			//document.getElementById("pp_storeName").value = "";
			document.getElementById("pp_storeName").placeholder = "Enter a Store Name";
		}else{
			document.getElementById("pp_storeName").value = lastRegistered.storeId;
		}
		if(lastRegistered.postcode == undefined){
			//document.getElementById("pp_zipcode").value = "";
			document.getElementById("pp_zipcode").placeholder = "Enter a Post code";
		}else{
			document.getElementById("pp_zipcode").value = lastRegistered.postcode;
		}

		var select = document.getElementById("selectRetailer"); 
 		var retailerList = JSON.parse(response).retailer; 
 		var retailer= [];

 		$.each(retailerList, function(key, obj) {

           retailer.push(key);

    	});

    	$( "#pp_retailer" ).autocomplete({
      		source: retailer
    	});
	}
	isJsonUploaded = false;
	showLogin();
  	$(".uploadJson").css('visibility','visible');
   
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

function shellCommand(selectedId,cmd){

	var Promise = require('bluebird')
	var adb = require('adbkit')
	var client = adb.createClient()

	client.shell(selectedId, cmd)
	.then(adb.util.readAll)
        .then(function(output) {
          console.log('[%s] %s', selectedId, output.toString().trim())
        })

  .then(function() {
    console.log('Done.')
    removeProgress('Completed!');
  })
  .catch(function(err) {
    console.error('shellCommand:Something went wrong:', err.stack)
  })
  
}


function editProfileShow(){
    $(".editProfileinner").css("visibility","visible");
}


function enableTextFields(){

	document.getElementById('pp_device').disabled = false;
	document.getElementById("land").disabled = false;
    document.getElementById("port").disabled = false;

	enableTags();
	    
    if(!isStore){

    	document.getElementById('pp_retailer').disabled = false;
    	document.getElementById('pp_storeName').disabled = false;
		document.getElementById('pp_zipcode').disabled = false;
	

    }else{
    	document.getElementById('pp_retailer').disabled = true;
    	document.getElementById('pp_storeName').disabled = true;
		document.getElementById('pp_zipcode').disabled = true;
    }
    

}

function disableTextFields(){		

    document.getElementById('pp_email').disabled = true;
    document.getElementById('pp_device').disabled = true;
    document.getElementById('pp_storeName').disabled = true;
    document.getElementById('pp_zipcode').disabled = true;
    document.getElementById('pp_country').disabled = true;
    document.getElementById('pp_country_name').disabled = true;
    document.getElementById("pp_retailer").disabled = true;
    document.getElementById("land").disabled = true;
    document.getElementById("port").disabled = true;
    disableTags();
  		
}

function getRegisterDetails(){

	var contact_email = document.getElementById("pp_email").value;
	var zipCode = document.getElementById('pp_zipcode').value;
	var retailer = document.getElementById('pp_retailer').value;
	var store = document.getElementById('pp_storeName').value;
	var displayCountry = document.getElementById('pp_country').value;
	var country = document.getElementById('pp_country_name').value;
	var deviceName = document.getElementById('pp_device').value;
	var isPortrait = document.querySelector('input[name="pp_portrait"]:checked').value;
	
	console.log(retailer);

	
	var tag = $('#regisTags').tagit('assignedTags');
 	$("#toastMsg1").removeClass("showSuccess");
	y = document.getElementById("toastMsg1")
	
    if(contact_email == ''){
    
    y.innerHTML = "Contact email can not be empty";	
    y.className = "show";
    //setTimeout(function(){ y.className = y.className.replace("show", ""); }, 3000);
   
    return '';
    
    }
    else if(zipCode == ""){
	
    y.innerHTML = "Post Code can not be empty";	
    y.className = "show";
    //setTimeout(function(){ y.className = y.className.replace("show", ""); }, 3000);
    
	return '';
	
    }
    else if(retailer == ""){
	
    y.innerHTML = "Retailer Name can not be empty";	
    y.className = "show";
   //setTimeout(function(){ y.className = y.className.replace("show", ""); }, 3000);
    
	return '';
	
    }
    else if(store == ""){
	
    y.innerHTML = "Store Name can not be empty";	
    y.className = "show";
    //setTimeout(function(){ y.className = y.className.replace("show", ""); }, 3000);
    
	return '';
	
    }
    
	else{
    if(tag == ""){
    
    	tag = [];
    	
    }
    
    onlineRegisData = new Object();
    
	onlineRegisData.contactEmail = contact_email;
	onlineRegisData.postcode = zipCode;
	onlineRegisData.retailerName = retailer;
	onlineRegisData.storeId = store;
	onlineRegisData.display_country_name = displayCountry;
	onlineRegisData.country = country;
	onlineRegisData.deviceName = deviceName ;
	onlineRegisData.tags = tag;
 	onlineRegisData.isPortrait = isPortrait;
 	onlineRegisData.isStore = isStore;
 	
 	if(isJsonUploaded){
 		remoteControlforClone = getRegisterSettings();
 		onlineRegisData.remort_control_user = remoteControlforClone;
 	}

	params = new Object();
	params.method = 'registration';
	params.args = onlineRegisData;
	
	params = JSON.stringify(params);
	
	//console.log('onlineRegisDataArgs::'+params.args);


    return params;
    
    }
    
}


function registerDeviceOnline(selecteddeviceId){

	displayingProgress('Registering');

   	var args = getRegisterDetails();

   	if(args != ''){
   
   	var obj_args = JSON.parse(args);
   	var obj_message = new Object();
   	obj_message.method = 'do_register()';
   	obj_message.action = '';
   	obj_message.args = obj_args;

   	//isJsonUploaded = false;

   	var cmd = "am broadcast -a com.multplx.android.mxdevad.peer --es message '"+JSON.stringify(obj_message)+"'";
    
    //displayingProgress('Registering');
    
    shellCommand(selecteddeviceId,cmd);
    
   }
}

function dateConverter(timestamp){

	var date = new Date(timestamp*1000);
	var dd = date.getDate();

	var yyyy = date.getFullYear();
	var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
	var month = months[date.getMonth()];
	var day = days[date.getDay()-1];

	if(dd<10){
    	dd='0'+dd
	} 

	var newDate = day+' '+dd+' '+month+' '+yyyy;
	return newDate;
}

function timeConverter(timestamp){

	var date = new Date(timestamp*1000);
	var hours = date.getHours();
	var minutes = "0" + date.getMinutes();
	var seconds = "0" + date.getSeconds();
	

    var mid='am';
    if(hours==0){ //At 00 hours we need to show 12 am
    mid = '';
    }
    else if(hours>12)
    {
    mid='pm';
    }
	
	var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2) + ' '+ mid;
	
	return formattedTime;
	
}

function setDeviceState(stateObject, registerObject){
  
  	var timestamp = null;
  	var screenWidth = 0;
  	var screenHeight = 0;
  	var f = 0;
  	var chagingState = 0;
  	
  	if(stateObject != undefined){
  	
  	console.log('StateObject::' + JSON.stringify(stateObject));
  	
  	try{
  	
  		timestamp = stateObject.deviceTime;
  	}catch(e){
  		console.log('Error:'+ e);
  	}
		formattedDate = dateConverter(timestamp);
		formattedTime = timeConverter(timestamp);

	try {
		
		screenWidth = registerObject.screenW;
	}catch(e){
  		console.log('Error:'+ e);
  	}
	try {
		
		screenHeight = registerObject.screenH;
	}catch(e){
  		console.log('Error:'+ e);
  	}

		f =  stateObject.temperature;
		console.log('Tempppppp:::'+f);
	
		var temperatureInC = f/10;

	try {
		chagingState = stateObject.batteryPlug;
	}catch(e){
  		console.log('Error:'+ e);
  	}	
		if(chagingState == 0){
			chagingState = "No";
		}
		if(chagingState == 1 || chagingState == 2){
			chagingState = "Yes";
		}
	
	try {
  		document.getElementById("date").innerHTML = formattedDate;
  		}catch(e){
  		console.log('Error:'+ e);
  	}
  	
  	try{
  		document.getElementById("time").innerHTML = formattedTime;
  		}catch(e){
  		console.log('Error:'+ e);
  	}
  	
  	try{
  		document.getElementById("timeZone").innerHTML = stateObject.timeZone.timeZone;
  		}catch(e){
  		console.log('Error:'+ e);
  	}
  	
  	try{
  		document.getElementById("batterylevel").innerHTML = stateObject.batteryLevel;
  		}catch(e){
  		console.log('Error:'+ e);
  	}
  	
  	try{
  		document.getElementById("charging").innerHTML = chagingState;
  		}catch(e){
  		console.log('Error:'+ e);
  	}
  	
  	try{
  		document.getElementById("temperature").innerHTML = temperatureInC +' C';
  		}catch(e){
  		console.log('Error:'+ e);
  	}
  	
  	try{
  		document.getElementById("serial").innerHTML = stateObject.deviceSerial; 
  		}catch(e){
  		console.log('Error:'+ e);
  	}
  	
  	try{
  		document.getElementById("displaySize").innerHTML = screenWidth +' x '+screenHeight;
  		}catch(e){
  		console.log('Error:'+ e);
  	}
  		
  	}
  		
  if(registerObject != undefined){
  
  	try{		
  		document.getElementById("os").innerHTML = registerObject.platform; 
  		}catch(e){
  		console.log('Error:'+ e);
  	}
  	
  	try{
  		document.getElementById("platformVersion").innerHTML = registerObject.platformVersion;
  		}catch(e){
  		console.log('Error:'+ e);
  	}
  	
  	try{
  		document.getElementById("mac").innerHTML = registerObject.mac;
  		}catch(e){
  		console.log('Error:'+ e);
  	}
  	
  	try{
  		document.getElementById("model").innerHTML = registerObject.deviceModel;
  		}catch(e){
  		console.log('Error:'+ e);
  	}
  	
  	try{
  		document.getElementById("registeredBy").innerHTML = registerObject.contactEmail;
  		}catch(e){
  		console.log('Error:'+ e);
  	}
  	
  	try{
  		document.getElementById("imei").innerHTML = registerObject.imei;
  		}catch(e){
  		console.log('Error:'+ e);
  	}
  	try{
  		document.getElementById("imeiNumber").innerHTML = registerObject.imeiNumber;
  		}catch(e){
  		console.log('Error:'+ e);
  	}

  	}
  	
	
}

function setProfile(registerObject, remoteControlObj){

 	document.getElementById("sp_email").disabled = true;
 	document.getElementById('sp_country_name').disabled = true;
	document.getElementById('sp_country').disabled = true;
	document.getElementById('sp_land').disabled = true;
	document.getElementById('sp_port').disabled = true;
	
 	if(isStore){
 		document.getElementById('sp_retailer').disabled = true;	
 		document.getElementById('sp_zipcode').disabled = true;
		document.getElementById('sp_storeName').disabled = true;
 	}else{
 		document.getElementById('sp_retailer').disabled = false;	
 		document.getElementById('sp_zipcode').disabled = false;
		document.getElementById('sp_storeName').disabled = false;
 	}
	
	var mail = registerObject.contactEmail;
	var retailerName = registerObject.retailerName;
	var postCode = registerObject.postcode;
	var storeName = registerObject.storeId;
	var country = registerObject.country;
	var displayCountry = registerObject.display_country_name;
	var registrationMode = registerObject.registered_orientation;
	var devicename = remoteControlObj.device_name;
	var tags = remoteControlObj.tags;

	document.getElementById("sp_email").value = mail;
	document.getElementById("sp_device").value = devicename;
	document.getElementById('sp_retailer').value =retailerName;
	document.getElementById('sp_country_name').value =country;
	document.getElementById('sp_zipcode').value = postCode;
	document.getElementById('sp_storeName').value = storeName;
	document.getElementById('sp_country').value = displayCountry;
	
		$('#profileTags').tagit("removeAll");
	
	if ( tags != null ) {	

		for (var index = 0; index <tags.length; index++) {
         	
         	$('#profileTags').tagit('createTag', tags[index]);
 
     	}
     	
     	
     	$(".tagit-close").find(".text-icon").html("");
     	
     	disableTags();
     	
	}

    if(registrationMode == 'SCREEN_ORIENTATION_LANDSCAPE'){
        document.getElementById("sp_land").checked=true;
    }else{
        document.getElementById("sp_port").checked=true;
    }
    
    temProfileObj = new Object();
    temProfileObj.retailerName = retailerName;
    temProfileObj.postCode = postCode;
    temProfileObj.storeId = storeName;
    
    	
	document.getElementById('rl_retailer').value = document.getElementById('sp_retailer').value;
	document.getElementById('rl_store').value = document.getElementById('sp_storeName').value;
	document.getElementById('rl_postcode').value = document.getElementById('sp_zipcode').value;
	
}

function getProfileData(){
	
	var retailerName = document.getElementById('rl_retailer').value;
	var country = document.getElementById('sp_country_name').value;
	var postCode = document.getElementById('rl_postcode').value;
	var storeName = document.getElementById('rl_store').value;


	var locationObj = new Object();
	locationObj.retailerName = retailerName;
	locationObj.country = country;
	locationObj.postCode = postCode;
	locationObj.storeId= storeName;
	
	var msgObj = new Object();
	msgObj.method = 'location_change';
	msgObj.args = locationObj;
		
	console.log('getProfileData::'+JSON.stringify(msgObj));

	
	if(temProfileObj.retailerName != retailerName || temProfileObj.postCode != postCode || temProfileObj.storeId != storeName){
	
		if(!isMyPlayerRestarting){
	
			updateLocationObject(JSON.stringify(msgObj));
			hideMenuScreens();
  			showDeviceState(false);
  			hideDeviceProfile();
		
		}else{
		
			var y = document.getElementById("toastMsg4");
    		y.innerHTML = "MyPlayer is restarting. Please try again later..";  
    		y.className = "show";
    		setTimeout(function(){ y.className = y.className.replace("show", ""); }, 3000);
    		startPeerServer(currentPort, selecteddeviceId);	

			
		}
		
		temProfileObj.retailerName = retailerName;
		temProfileObj.postCode = postCode;
		temProfileObj.storeId = storeName;
		
	}
	
}

function updateLocationObject(updatedLocationObject){

   isDeviceClicked = false;
   if(updatedLocationObject != ''){
   
   	var obj_args = JSON.parse(updatedLocationObject);
   	var obj_message = new Object();
   	obj_message.method = 'do_relocate()';
   	obj_message.action = '';
   	obj_message.args = obj_args;

   	var cmd = "am broadcast -a com.multplx.android.mxdevad.peer --es message '"+JSON.stringify(obj_message)+"'";
   	
   	console.log(cmd);
    shellCommand(selecteddeviceId,cmd);
    
    }
}

function setSettingsInfo(remoteControlObj,stateObject){

	if(remoteControlObj != '{}'){
		isUnregistered = false;
		document.getElementById('deviceStateMessagefield').innerHTML = "MYPLAYER DEVICE";
		$("#editSettings").show();

		var time = formattedTime.replace(/:\d+ (\w\w)$/, '$1');
		document.getElementById('editsettings_devicetime').innerHTML = "Device time is now "+ time +" on "+ formattedDate +", at "+ stateObject.timeZone.timeZone;
	
		$(".settingsformBody").show();

		var isWifiLockOn = JSON.parse(remoteControlObj).wifiLockOn;
		var isLockScreenOn = JSON.parse(remoteControlObj).lockScreen;
		var isplayMediaOn = JSON.parse(remoteControlObj).presentationOn;
		var isPowerSaverOn = JSON.parse(remoteControlObj).presentation.powerSave.enabled;
		var isWatchDogOn = JSON.parse(remoteControlObj).presentation.listener;
		var isTwentyFourSeven = JSON.parse(remoteControlObj).presentation.playTime.playTimeActive;
		isRegisteredToStore = JSON.parse(remoteControlObj).registrar_is_store;
	
		var playTimeActive;
		if(isTwentyFourSeven){
			playTimeActive = false;
		}else{
			playTimeActive = true;
	}
	
	
	document.getElementById("wifiLock").checked = isWifiLockOn;
	document.getElementById("lockScreen").checked = isLockScreenOn;
	document.getElementById("playMedia").checked = isplayMediaOn;
	document.getElementById("powerServer").checked = isPowerSaverOn;
	document.getElementById("watchdog").checked = isWatchDogOn;
	
	console.log('isTwentyFourSeven::'+ isTwentyFourSeven);
	
	document.getElementById("twentyFourSeven").checked = playTimeActive;
	

    if (isplayMediaOn) {
      $("#editSettingsBlock_powersave").slideDown();
      $("#editSettingsBlock_twentyfourseven").slideDown();
      $("#testDiv").slideDown();
      
      
    }else{
    	$("#editSettingsBlock_powersave").slideUp();
    	$("#editSettingsBlock_twentyfourseven").slideUp();
    	$("#testDiv").slideUp();
    }
    
    var fromTime = '09:00';
    var toTime = '18:00';
	
	if(isTwentyFourSeven){
	
		$("#timeSetting").slideDown();
    	$("#editsettings_pt_message").html("Please select the time and days you wish to play media.");
	
	 		
		 fromTime = JSON.parse(remoteControlObj).presentation.playTime.from;
		 toTime = JSON.parse(remoteControlObj).presentation.playTime.to;

		
		var dateSelected = JSON.parse(remoteControlObj).presentation.playTime;
		
		var isMonday = dateSelected.monday.presentationOn;
		var isTuesday = dateSelected.tuesday.presentationOn;
		var isWednesday = dateSelected.wednesday.presentationOn;
		var isThursday = dateSelected.thursday.presentationOn;
		var isFriday = dateSelected.friday.presentationOn;
		var isSaturday = dateSelected.saturday.presentationOn;
		var isSunday = dateSelected.sunday.presentationOn;

		$(".play_date_time").removeClass("play_date_timeSelected");
		
		if(isMonday){
    	$('#ply_mon').addClass("play_date_timeSelected");
    	
    	}
    	if(isTuesday){
    		$('#ply_tue').addClass("play_date_timeSelected");
    		
    	}
    	if(isWednesday){
    		$('#ply_wed').addClass("play_date_timeSelected");

    	}
    	if(isThursday){
    		$('#ply_thu').addClass("play_date_timeSelected");
    	}
    	
    	if(isFriday){
    		$('#ply_fri').addClass("play_date_timeSelected");
    	}
    	
    	if(isSaturday){
    		$('#ply_sat').addClass("play_date_timeSelected");
    	}
    	
    	if(isSunday){
    		$('#ply_sun').addClass("play_date_timeSelected");
    	}

	}else{
    	  	
    	$("#timeSetting").slideUp();
    	$("#editsettings_pt_message").html("Your Kiosk is set to play 24 hours.Please turn off 24/7 to customize.");
    }
    	document.getElementById("settings_timefrom").value = fromTime;
		document.getElementById("settings_timeto").value =toTime ;
    
}else{
	isUnregistered = true;
	document.getElementById('deviceStateMessagefield').innerHTML = "UNREGISTERED DEVICE";
	$("#editSettings").hide();
	$(".profileInfo").fadeOut(0);	
	
}
	
}

function getSettingsInfo(){

	$("#toastMsg2").removeClass("showSuccess");
	var deviceName = document.getElementById("sp_device").value;
	var tag = $('#profileTags').tagit('assignedTags');
	if(tag == ""){
    
    	tag = [];
    	
    }
	var wifiLock = document.getElementById("wifiLock").checked;
	var lockScreen = document.getElementById("lockScreen").checked;
	var playMedia = document.getElementById("playMedia").checked;
	var powerSaver = document.getElementById("powerServer").checked;
	var watchdog = document.getElementById("watchdog").checked;
	var twentyFourSeven = document.getElementById("twentyFourSeven").checked;
	var fromTime;
	var toTime;
	//if(twentyFourSeven){
		
		fromTime = document.getElementById("settings_timefrom").value;
		toTime = document.getElementById("settings_timeto").value;

	//}
	
	if(toTime < fromTime){
		var y = document.getElementById("toastMsg2");
		y.innerHTML = "To time is set to 00.00";	
    	y.className = "show";
    	$(".loader").css('display','none');
    	setTimeout(function(){ y.className = y.className.replace("show", ""); }, 2000);

	}
	
	var playTimeActive;
	if(twentyFourSeven){
		playTimeActive = false;
	}else{
		playTimeActive = true;
	}
	

	var rmObj = remoteControlObj;

	rmObj.wifiLockOn = wifiLock;
	rmObj.lockScreen = lockScreen;
	rmObj.presentationOn = playMedia;
	rmObj.presentation.powerSave.enabled = powerSaver;
	rmObj.presentation.listener = watchdog;
	rmObj.presentation.playTime.playTimeActive = playTimeActive;
	rmObj.presentation.playTime.from = fromTime;
	rmObj.presentation.playTime.to = toTime;
	rmObj.device_name = deviceName;
	rmObj.tags = tag;
	
	
	
	if($( "#ply_mon" ).hasClass( "play_date_timeSelected" )){
		rmObj.presentation.playTime.monday.presentationOn = true;
	}else{
		rmObj.presentation.playTime.monday.presentationOn = false;
		}
	if($( "#ply_tue" ).hasClass( "play_date_timeSelected" )){
		rmObj.presentation.playTime.tuesday.presentationOn = true;
	}else{
		rmObj.presentation.playTime.tuesday.presentationOn = false;
		}
	if($( "#ply_wed" ).hasClass( "play_date_timeSelected" )){
		rmObj.presentation.playTime.wednesday.presentationOn = true;
	}else{
		rmObj.presentation.playTime.wednesday.presentationOn = false;
		}
	if($( "#ply_thu" ).hasClass( "play_date_timeSelected" )){
		rmObj.presentation.playTime.thursday.presentationOn = true;
	}else{
		rmObj.presentation.playTime.thursday.presentationOn = false;
		}
	if($( "#ply_fri" ).hasClass( "play_date_timeSelected" )){
		rmObj.presentation.playTime.friday.presentationOn = true;
	}else{
		rmObj.presentation.playTime.friday.presentationOn = false;
		}
	if($( "#ply_sat" ).hasClass( "play_date_timeSelected" )){
		rmObj.presentation.playTime.saturday.presentationOn = true;
	}else{
		rmObj.presentation.playTime.saturday.presentationOn = false;
		}
	if($( "#ply_sun" ).hasClass( "play_date_timeSelected" )){
		rmObj.presentation.playTime.sunday.presentationOn = true;
	}else{
		rmObj.presentation.playTime.sunday.presentationOn = false;
		}
		
	console.log('sending settings:::',JSON.stringify(rmObj));
	var msgObj = new Object();
	msgObj.method = 'remortControl_change';
	msgObj.args = rmObj;
	
	if(!isMyPlayerRestarting){

		updateRemoteControlObject(JSON.stringify(msgObj));
		hideMenuScreens();
  		showDeviceState(false);
  		hideDeviceProfile();
		isDeviceClicked = false;
	}else{
		var y = document.getElementById("toastMsg2");
    	y.innerHTML = "MyPlayer is restarting. Please try again later..";  
    	y.className = "show";
    	setTimeout(function(){ y.className = y.className.replace("show", ""); }, 3000);
    	startPeerServer(currentPort, selecteddeviceId);	

	}
}

function updateRemoteControlObject(updatedObject){

	displayingProgress('Updating Settings');

   if(updatedObject != ''){
   
   	var obj_args = JSON.parse(updatedObject);
   	var obj_message = new Object();
   	obj_message.method = 'do_remortcontrol_change()';
   	obj_message.action = '';
   	obj_message.args = obj_args;

   var cmd = "am broadcast -a com.multplx.android.mxdevad.peer --es message '"+JSON.stringify(obj_message)+"'";
    
    //displayingProgress('Registering');
    
    shellCommand(selecteddeviceId,cmd);
    var y = document.getElementById("toastMsg2");
    y.innerHTML = "Successfully Updated!";  
    y.className = "show showSuccess";
    setTimeout(function(){ y.className = y.className.replace("show", ""); }, 3000);
   }
}

function getConnectedWifi(connectedWifiObject){

	connectdSsid = connectedWifiObject.connectedSsid;
	isOnline = connectedWifiObject.isOnline;

	document.getElementById('wifiNetwork').style.pointerEvents = 'auto';
	connectdSsid = connectdSsid.replace(/^"(.*)"$/, '$1');
	
	document.getElementById('wifiNetwork').innerHTML = "";
	
	if(connectdSsid == ""){
		document.getElementById('wifiNetwork').innerHTML = "Connect to wifi"	
	}else{
		document.getElementById('wifiNetwork').innerHTML = connectdSsid;
	}
	
	if(myPlayerVersion != undefined){
		document.getElementById('myPlayerVersion').innerHTML = myPlayerVersion;
	}else{
		document.getElementById('myPlayerVersion').innerHTML = "";
	}
	
	wifiArray = connectedWifiObject.wifiList;

	console.log('********getConnectedWifi******' + wifiArray);
	
	var wifiArray = wifiArray.slice(1, -1);
	var splits = wifiArray.split(",");
	
	var wifiList = [];
	
	for(i=0;i<splits.length;i++){
	
    wifiList.push(splits[i]);  
          
	}
	
 	$("#wifiId").autocomplete({
       	source: wifiList
    });
		
}

function connectedToInternet(internetObject){

	document.getElementById('wifiNetwork').innerHTML = "Connect to wifi "
	document.getElementById('wifiNetwork').style.pointerEvents = 'auto';
	isOnline = internetObject.isOnline;
	if(myPlayerVersion != undefined){
		document.getElementById('myPlayerVersion').innerHTML = myPlayerVersion;
	}else{
		document.getElementById('myPlayerVersion').innerHTML = "";
	}

}

function connectedToEthernet(ethernetObject){

	document.getElementById('wifiNetwork').innerHTML = "Ethernet"
	document.getElementById('wifiNetwork').style.pointerEvents = 'none';
	
	if(myPlayerVersion != undefined){
		document.getElementById('myPlayerVersion').innerHTML = myPlayerVersion;
	}else{
		document.getElementById('myPlayerVersion').innerHTML = "";
	}
	
	isOnline = ethernetObject.isOnline;
}

function setApplications(appDetailArray){

	var selectedId = selectedId;
	$("#applicationHolderWrapper").empty();
	
	$.each( appDetailArray, function( key, value ) {
	
		console.log('value::'+JSON.stringify(value));
		
  		var packageName = value.package;
  		var array = installedAppArray[0];
  		
  		console.log('packageName Name::'+packageName);
  		
  		try{
  			
		$('<div class="applicationHolder" id="holder'+value.name+'"><div class="appIconHolder" id="appIconHolder'+value.name+'"><div class="appIcon"><img id="img'+value.name+'" src="assets/'+value.name+'.png" /></div><div class="appName">'+value.name+'</div></div><div class="checkBoxHolder"><span class="installCheckBoxHolder" id="installCheckBoxHolder'+value.name+'"><input class="installCheckstyle" type="checkbox" name="apps" value="'+value.name+'" id="checkbox'+value.name+'"><label for="checkbox'+value.name+'"></label></span><div id="installedLabel'+value.name+'" class ="installedLabel"><div class="installedLabelText">Installed</div><span class="uninstallCheckBoxes"><input type="checkbox" name="uninstallApps" value="'+packageName+'" id="unInstallCheckbox'+value.name+'" data-appName="'+value.name+'"><label for="unInstallCheckbox'+value.name+'"></label></span></div></div></div>').appendTo( "#applicationHolderWrapper" );
		
			for(var i=0;i<array.length;i++){
  		 
  			if(packageName == array[i]){
  		
  		 		console.log('Installed app found::'+packageName);
  		 		document.getElementById("checkbox"+value.name).disabled = true;
  		 		document.getElementById("appIconHolder"+value.name).style.opacity = "1";
  		 		$('#installCheckBoxHolder'+value.name).fadeOut(0);
  		 		$('#installedLabel'+value.name).fadeIn(0);
  		  
  		 }
  		}
		
		}catch(e){
			console.log('error appending apps');
		}
	});
	

}

 $('input[type=checkbox]').click(function (e) { e.stopPropagation(); });

function installedAppList(selectedId,appDetailArray){

	var Promise = require('bluebird')
	var adb = require('adbkit')
	var client = adb.createClient()

	client.listDevices()
  	.then(function(devices) {
   	
    return Promise.map(devices, function(device) {
    
      return client.getPackages(selectedId)
    })
  })
  .then(function(packages) {
    console.log('installedAppList',packages);
    installedAppArray = packages;
    setApplications(appDetailArray);

  })
  .catch(function(err) {
    console.error('Something went wrong:', err.stack)

  })

}

$(function(){
        
    $('#regisTags').tagit();
    $('#profileTags').tagit();
          	
    $('.tagit-new').unbind('keyup').keyup(function() {

    var tagVal = $('.tagit-new input').val();
    	if (/^[a-zA-Z0-9._()]*$/.test(tagVal) == false ){
        		$('.tagit-new input').val(tagVal.substring(0,tagVal.length-1));
    	}
    });

});

        
function displayingProgress(stateText){

 	if(stateText == "Installing"){
 	
   		$('.progress_state_1').fadeIn(0);
 	}else{
   		$('.progress_state_2').fadeIn(0);
 	}
  
   $(".progress_state").css("visibility","visible");
   $(".progressText").html(stateText);
   $(".dots").css("visibility","visible");
}

function removeProgress(stateText){

 	$(".progressText").html(stateText);
   	$('.progress_state').delay(2000).fadeOut(0);
   	$(".dots").css("visibility","hidden");
}


function hideDeviceSettings(){
  //$(".deviceSettingsDetailWrapper").fadeOut(500);
  //$(".settingPanelFormWrapper").css('visibility','hidden');
  $(".settingPanelFormWrapper").fadeOut(0);		
  $(".profileInfo").fadeIn(0);	
  $(".deviceSettingsDetailWrapper").fadeOut(500);	
  $("#editSettingsShow").fadeIn(0);		
  $("#editSettings").fadeOut(0);
}


function enableSettingsFields(){

  $(".onoffswitch input").attr("disabled", false);
  $("#twentyFourSevenlb").css('pointer-events','auto');
  $(".play_date_time").css('pointer-events','auto');
  document.getElementById('settings_timefrom').disabled = false;
  document.getElementById('settings_timeto').disabled = false;
  $(".onoffswitch").css('opacity','1');

  document.getElementById('sp_device').disabled = false;
  enableTags();
  
 // if(!isStore && !isUnknownUser){
  
  	document.getElementById('sp_retailer').disabled = true;
  	document.getElementById('sp_storeName').disabled = true;
  	document.getElementById('sp_zipcode').disabled = true;
  	
 // }else{
  
//   	document.getElementById('sp_retailer').disabled = true;
//   	document.getElementById('sp_storeName').disabled = true;
//   	document.getElementById('sp_zipcode').disabled = true;
//  }

  
}

function disableSettingsFields(){
 
 document.getElementById("sp_device").disabled = true;

  $(".onoffswitch input").attr("disabled", true);		
  $("#twentyFourSevenlb").css('pointer-events','none');		
  $(".play_date_time").css('pointer-events','none');		
  document.getElementById('settings_timefrom').disabled = true;		
  document.getElementById('settings_timeto').disabled = true;		
  $(".onoffswitch").css('opacity','0.5');
  		
}

function disableTags(){
	$('.ui-autocomplete-input').prop('disabled', true).val('');
    $('ul.tagit').css({'opacity':'1','background-color':'rgb(235, 235, 228)'});
    $("#wifiId").prop('disabled', false);
}

function enableTags(){
    $('.ui-autocomplete-input').prop('disabled', false);
    $('ul.tagit').css({'opacity':'1','background-color':'rgb(255, 255, 255)'});
}


/*------Socket Connection------*/

function connectSocket(selecteddeviceId,userPort){

	console.log('connectSocket');
	var Promise = require('bluebird')
	var client = require('adbkit').createClient()

	client.listDevices()
 		.then(function(devices) {
   		return Promise.map(devices, function(device) {
   		
   		if ( device.id == selecteddeviceId ) {
   		
   			try{
     		
   				var rcvdData = '';
   				return client.openTcp(device.id, userPort, function(err, conn) {
   				
   				if(conn != undefined){
   					console.log('connectSocket1');
       				conn.write('{DeviceId:'+device.id+'}');

       				conn.on('data', function(data) {

       				rcvdData += data;
       			
       				try {
       					//console.log('rcvdData :'+ rcvdData);
       				
						var obj = JSON.parse(rcvdData);	
						rcvdData = '';				
						performWork(obj);

					}
					catch(e) {
					console.log('connectSocket2');
						console.log('e :'+ e);
					}
				
								
				});
			


			conn.on('close', function() {

				console.log('Connection closed');
			});

				currentConn = conn;	
				document.getElementById('wifiNetwork').style.pointerEvents = 'auto';
				}else{
					$(".deviceStateLoader").removeClass("deviceStateLoaderShow");
					document.getElementById('deviceStateMessagefield').innerHTML = "Install MyPlayer";
					$('#deviceStateMessagefield').fadeIn();
					$(".deviceSettingsDetailWrapper").fadeIn(100);
					$("#deviceStateMessagefield").show();
					$("#editSettings").hide();
					document.getElementById('wifiNetwork').style.pointerEvents = 'none';
					document.getElementById('myPlayerVersion').innerHTML = "";
				}


       	});
       
       	}catch(e1) {
       		console.log('connectSocket5');
			hideDeviceProfile();
    		hideDeviceState();
			$("#editSettings").hide();

		}

   	}
     	
   })
 })

}

function performWork(data) {

	console.log('perform work:'+JSON.stringify(data));
	isValidResponse = true;
	console.log('perform work:isValidResponse'+isValidResponse);
	
	
	if(data.isReady != undefined){
	
	 	if(data.isReady == false){
	 	
	 		console.log('wait for data');

			if(((!isMenuClicked && isDeviceClicked) || connectedtoFirst) ){
				document.getElementById('deviceStateMessagefield').innerHTML = "Data could not be loaded..";
				$('#deviceStateMessagefield').fadeIn();
				$(".deviceSettingsDetailWrapper").fadeIn(100);
				$("#deviceStateMessagefield").show();
				$("#editSettings").fadeOut(0);
			}
	 	}		
	}
	
	else if(data.key == 'noInternet'){
		
		internetObject = data.response;
		console.log('internetObject::' + JSON.stringify(internetObject));
		$(".deviceStateLoader").removeClass("deviceStateLoaderShow");
		try{
		myPlayerVersion = internetObject.myPlayerVersion;
		var fields = myPlayerVersion.split('mX_');
		myPlayerVersion = fields[1];
		}catch(e){
			console.log('Exception: retrieving myPlayerVersion');
		}
		isEthernet = false;
		connectedToInternet(internetObject);
	} 
	
	else if(data.key == 'ethernet'){
		
		ethernetObject = data.response;
		console.log('ethernetObject::' + JSON.stringify(ethernetObject));
		try{
		myPlayerVersion = ethernetObject.myPlayerVersion;
		var fields = myPlayerVersion.split('mX_');
		myPlayerVersion = fields[1];
		}catch(e){
			console.log('Exception: retrieving myPlayerVersion');
		}
		isEthernet = true;
		connectedToEthernet(ethernetObject);
		
		
	}
	
	else if(data.key == 'wifi'){
		
		connectedWifiObject = data.response;
		console.log('connectedWifiObject::' + JSON.stringify(connectedWifiObject));
		try{
			myPlayerVersion = connectedWifiObject.myPlayerVersion;
			var fields = myPlayerVersion.split('mX_');
			myPlayerVersion = fields[1];
		}catch(e){
			console.log('Exception: retrieving myPlayerVersion');
		}
		
		isEthernet = false;
		getConnectedWifi(connectedWifiObject);
	}
		
	else if(data.key == 'StateObject'){
		console.log('stateObj:'+data.response.campaignId+'::'+ data.response.state);
		var stateObject = data.response;
		displayStatus(stateObject);
	}
	
	else if(data.key == 'appDetailObject'){
		
		var appDetailArray = data.response;
		console.log('appDetailArray:'+appDetailArray);
		
		
		var appDetailArray = $.parseJSON(appDetailArray);
		applicationObject = appDetailArray;
		installedAppList(selecteddeviceId,appDetailArray);
		
	}

	else if(data.CompletedResponse == true){
	
		//console.log(data.key);
	
	 if(data.key == 'relocate'){
	 	document.getElementById('complete_state').innerHTML = "";
	 	console.log(data.response);
	 	var deviceId = data.response.DeviceId.split(/[:}]/);
	 	document.getElementById('complete_state').innerHTML = data.response.CompletionState +" for device "+deviceId[1];
	 	setTimeout(function(){ document.getElementById('complete_state').innerHTML = ""; }, 5000);
	
	 }
	 if(data.key == 'remoteControlUpdate'){
	 	document.getElementById('complete_state').innerHTML = "";
	 	console.log(data.response);
	 	var deviceId = data.response.DeviceId.split(/[:}]/);
	 	document.getElementById('complete_state').innerHTML = data.response.CompletionState +" for device "+deviceId[1];
	 	setTimeout(function(){ document.getElementById('complete_state').innerHTML = ""; }, 7000);
	 	
	 }
	 if (data.key == 'register'){
	 	document.getElementById('complete_state').innerHTML = "";
	 	console.log(data.response);
	 	var deviceId = data.response.DeviceId.split(/[:}]/);
	 	document.getElementById('complete_state').innerHTML = data.response.CompletionState +" device "+deviceId[1];
	 	setTimeout(function(){ document.getElementById('complete_state').innerHTML = ""; }, 7000);
	 	
	 	var y = document.getElementById("toastMsg1");
	 	try{ 
	 	if(data.response.isSuccess){       
    	y.innerHTML = "Registered!";
    	y.style.backgroundColor= '#008000';
    	}else{
    	y.innerHTML = "Registration Failed!";
    	y.style.backgroundColor= '#ff0000';
    	}
    	y.className = "show showSuccess";
    	setTimeout(function(){ y.className = y.className.replace("show", ""); }, 3000);
    	
    	}catch(e){
    	console.log('data.response.isSuccess NULL');
    	}  

    	
    	//getPlayList();
	 }
	 if (data.key == 'sideload'){
	 	document.getElementById('complete_state').innerHTML = "";
	 	console.log(data.response);
	 	var deviceId = data.response.DeviceId.split(/[:}]/);
	 	document.getElementById('complete_state').innerHTML = data.response.CompletionState +" for device "+deviceId[1];
	 	setTimeout(function(){ document.getElementById('complete_state').innerHTML = ""; }, 7000);	
	    //removeProgress('Completed!');	
	    var y = document.getElementById("toastMsg6");
    	y.innerHTML = "Sideload Completed";  
    	y.className = "show showSuccess";
    	setTimeout(function(){ y.className = y.className.replace("show", ""); }, 3000);		
	 }
	 if (data.key == 'connectToWifi'){
	 	document.getElementById('complete_state').innerHTML = "";
	 	$(".wifiConnection").fadeOut(500);
	 	console.log(data.response);
	 	var deviceId = data.response.DeviceId.split(/[:}]/);
	 	document.getElementById('complete_state').innerHTML = data.response.CompletionState +" for device "+deviceId[1];
	 	document.getElementById('wifiNetwork').innerHTML = data.response.ConnectedNetwork;
	 	setTimeout(function(){ document.getElementById('complete_state').innerHTML = ""; }, 7000);
	    $(".wifiloader").css("display","none");
	    isOnline = true;
	    isEthernet = false;
	    
	 }

	 if (data.key == 'restart'){
	 	isMyPlayerRestarting = true;
	 	isDeviceClicked = false;
	 	isMenuClicked = false;
	 	connectedtoFirst = false;
	 	document.getElementById('complete_state').innerHTML = "";
	 	console.log(data.response);
	 	var deviceId = data.response.DeviceId.split(/[:}]/);
	 	
	 	document.getElementById('complete_state').innerHTML = data.response.CompletionState +" in device "+deviceId[1];	
	 	setTimeout(function(){ document.getElementById('complete_state').innerHTML = ""; }, 20000);		
	 }

	}
	else{
	
		isMyPlayerRestarting = false;

		if(data.accountType.response != undefined){
			isStore = data.accountType.response;	
			isUnknownUser= false;
			/*var y = document.getElementById("toastMsg3")
			y.innerHTML = "User type can not be identified";	
    		y.className = "show";
    		setTimeout(function(){ y.className = y.className.replace("show", ""); }, 3000);*/
		}
		else{
		isUnknownUser = true;
		}
		
	
		stateObject = data.deviceStateObject.response;
		remoteControlObj = data.remoteControlObject.response;
		registerObject = data.registerObject.response;
		//applicationObject = data.applicationObject.response;
		istalledAppJson = data.installedApplicationObject.response;

		if(((!isMenuClicked && isDeviceClicked) || connectedtoFirst) ){
	
			$("#deviceStateMessagefield").show();
			showDeviceState(false);
			//getPlayList();
			setDeviceState(stateObject,registerObject);
			setSettingsInfo( JSON.stringify(remoteControlObj),stateObject);
			setProfile(registerObject,remoteControlObj);
			//installedAppList(selecteddeviceId);
			
		}else{
			installedAppList(selecteddeviceId,applicationObject);
		}

	}
}

function closeSocket(selecteddeviceId,userPort, isServerStart){

	if(currentConn != null){
		currentConn.destroy();
	}
	
	if(isServerStart)
			startPeerServer(userPort, selecteddeviceId);
			
	currentConn.on('close', function() {
		console.log('inside closeSocket close::');
		
	})
}

  
function startPeerServer ( port, selecteddeviceId ) {

	var Promise = require('bluebird')
	var adb = require('adbkit')
	var client = adb.createClient()
  
   var obj_message = new Object();
   obj_message.method = 'start_peer_server()';
   obj_message.action = '';
   obj_message.params = [port];

    var cmd = "am broadcast -a com.multplx.android.mxdevad.peer --es message '"+JSON.stringify(obj_message)+"'";
    
    client.shell(selecteddeviceId, cmd)
.then(adb.util.readAll)
        .then(function(output) {
          console.log('OUTPUT:::[%s] %s', selecteddeviceId, output.toString().trim())
        })

  .then(function() {
  
  		console.log('Peer Server Start on '+ port);

      	connectSocket(selecteddeviceId,port);

    
  })
  .catch(function(err) {
  	console.log('Peer Server Start fail '+ err);
  	$("#connectedDeviceList").empty();
  	listDevices();
    
  })

}


function stopPeerServer(port, selecteddeviceId) {

		var Promise = require('bluebird')
		var adb = require('adbkit')
		var client = adb.createClient()

  
  		var obj_message = new Object();
   		obj_message.method = 'stop_peer_server()';
   		obj_message.action = '';
   		obj_message.params = [port];

    var cmd = "shell:am broadcast -a com.multplx.android.mxdevad.peer --es message '"+JSON.stringify(obj_message)+"'";
    
	//console.log(cmd);
    
    client.shell(selecteddeviceId, cmd)
.then(adb.util.readAll)
        .then(function(output) {
          console.log('OUTPUT:::[%s] %s', selecteddeviceId, output.toString().trim())
        })

  .then(function() {
  
  		console.log('Peer Server Stop '+ port);

      	closeSocket(selecteddeviceId,port);

    
  })
  .catch(function(err) {
    console.error('shellCommand:Something went wrong:', err.stack)
  })

}

/* PlayList */

function getPlayList(){

	if(!isUnregistered){

	var paramJson = new Object(); 
	paramJson.contactEmail = registerObject.contactEmail;
	paramJson.device_id = registerObject.imei;
	paramJson.lockPin =  registerObject.remote_control.restricted.lockPin;
	
	paramJson = JSON.stringify(paramJson);

	var url = "https://player.multplx.com/api/available_campaigns";
	console.log('url:'+ url);
	var xhr = createCORSRequest('POST', url);

	if (!xhr) {
		console.log('error');
  		throw new Error('CORS not supported');
	}
	
	var params = "json="+paramJson;
	xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	
	
  	xhr.onload = function() {
  		var mediaQ = xhr.responseText;
  		//console.log('campaignResponse '+ mediaQ);
  		loadPlaylist(mediaQ);
  				
  	};
  	
  	xhr.onerror = function() {
   		console.log('Woops, there was an error making the request.');
  	};

  	xhr.send(params);
  	
  	}

}

function loadPlaylist(mediaQ){

 var mediaQ = JSON.parse(mediaQ);
 		var mediaQArray = [];

 		$.each(mediaQ, function(key, obj) {

           mediaQArray.push(obj);

    	});

	for(i=0; i< mediaQArray.length; i++){
	
    var date = mediaQArray[i].start.split(/[T]/);
    		var banner = mediaQArray[i].banners;
    		var imageUrl;
		$.each(banner, function(key, obj) {

           imageUrl = obj.thumbnailURL;
           console.log('imageUrl:::'+imageUrl);
 

    	});
    	$('<div class="listcampaign" id = "'+mediaQArray[i].id+'"><div class="campaignImage"><img src="'+imageUrl+'" /></div><div class="campaignDetails"><div class="campaignName">'+mediaQArray[i].name+'</div><div class="campaignId">ID <span>'+mediaQArray[i].id+'</span></div><div class="campaignModifiedDate">'+date[0]+'</div></div><div id = "msg'+mediaQArray[i].id+'"class="sentMessage"></div></div>').appendTo( "#playListHolderInner" );

    }
	

     $(".listcampaign").unbind('click').bind('click' ,function(){
     
     console.log('Clicked campaign:'+ this.id);
     selectedCampaignId = this.id;
    
     $(this).toggleClass("listcampaign_selected");
     
     //var isAssigned;
     if ($(this).hasClass("listcampaign_selected")){
     	isAssigned = 'Download'; 
	}else{
	//$(this).toggleClass("listcampaign_selected");
		isAssigned = 'Delete';
	}
     openAlertDialog(isAssigned);
     
	}); 

}

function openAlertDialog(isAssigned){
 
	if(!isAlertOpened){ 
		const informationBtn = document.getElementById('information-dialog')
		ipc.send('open-information-dialog',isAssigned)
		isAlertOpened = true;
	}
}

function displayStatus(stateObject){

	var campaignId = stateObject.campaignId;
	var state = stateObject.state;
	try{
		var msgDiv = document.getElementById("msg"+campaignId);
		if(msgDiv != null){
			msgDiv.innerHTML = state;
		}
	}catch(e){
		console.log(e);
	}
}


function playlistItemClick() {

	var campaignJson = new Object();
 	campaignJson.contactEmail = registerObject.contactEmail;
 	campaignJson.device_id = registerObject.imei;
 	campaignJson.lockPin =  registerObject.remote_control.restricted.lockPin;
	campaignJson.campaign_id = selectedCampaignId;
	
	var msgObj = new Object();
	msgObj.method = 'campaign_download';
	msgObj.args = campaignJson;
	
	sendCampaignToDownload(JSON.stringify(msgObj));
	
}

function sendCampaignToDownload(campaignObj){
	
	if(campaignObj != ''){
   
   	var obj_args = JSON.parse(campaignObj);
   	var obj_message = new Object();
   	obj_message.method = 'do_campaignDownload()';
   	obj_message.action = '';
   	obj_message.args = obj_args;

   	var cmd = "am broadcast -a com.multplx.android.mxdevad.peer --es message '"+JSON.stringify(obj_message)+"'";
   	
   	console.log(cmd);
    shellCommand(selecteddeviceId,cmd);
    
    }
   
}