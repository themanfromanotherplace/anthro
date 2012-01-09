/**
 * @fileoverview Venda.Widget.RegionLangSwitch
 *
 * @author Arunee Keyourawong (May) <mayk@venda.com>
 */
Venda.namespace("Widget.RegionLangSwitch");
var dialogSelectObj = '';
Venda.Widget.RegionLangSwitch.createDialog =  function(selectedObj){
	var dialogObj = jQuery(selectedObj);
	dialogSelectObj = dialogObj;
	var dialogOpts = {autoOpen: false, dialogClass: 'regionView', height:119, width:221, closeOnEscape:false,resizable: false, modal: false,close: function() {dialogObj.addClass("hide");}}
	dialogObj.dialog(dialogOpts);
	dialogObj.removeClass("hide");
	jQuery(".ui-dialog").popupIframe();
	dialogObj.dialog("open");
	jQuery(".regionView").appendTo("#header");
	if(RLSwitchEnable == 1){/* this section need for hiding the 'close' button when you visit the site first time.*/
		if((!Venda.Ebiz.CookieJar.get("lang")) && (!Venda.Ebiz.CookieJar.get("locn"))){
			jQuery(".ui-dialog-titlebar").hide();
		}	
	}
	 jQuery('.cancel').mouseover(function() {
		jQuery('.cancel').css("text-decoration","underline");
});
	jQuery('.cancel').mouseout(function() {
		jQuery('.cancel').css("text-decoration","none");
});	
	jQuery(".cancel").click(function(){
	jQuery(this).css("text-decoration","none");
	Venda.Widget.RegionLangSwitch.closeDialog();
		return false;
	});
};
Venda.Widget.RegionLangSwitch.closeDialog =  function(){
		if(dialogSelectObj){	dialogSelectObj.dialog( "destroy" ); }
		jQuery(".currency").find("a").removeClass("selected");
		jQuery(".region").find("a").removeClass("selected");
		jQuery(".regionLangSwitchContent").find("#txtswitchcur").removeClass("selected");
		jQuery(".regionLangSwitchContent").find("#txtswitchlang").removeClass("selected");
		jQuery(".rLSwitchSubmit").removeClass("selectDone");
};
var currRegion = Venda.Ebiz.CookieJar.get("locn");
var currLang = Venda.Ebiz.CookieJar.get("lang");
var workflow = '';
var chRegion = '';
var chLang = '';
var sURL = unescape(location.href);	
Venda.Widget.RegionLangSwitch.changeRegionLangDropDown = function(selectedObj,chType){
	if(chType == 'setlocn'){	
		chRegion = jQuery(selectedObj).val();	
		Venda.Widget.RegionLangSwitch.doURL(currRegion,chRegion,workflow,chType);			
	}else{
		chLang = jQuery(selectedObj).val();
		Venda.Widget.RegionLangSwitch.doURL(currLang,chLang,workflow,chType);
	}
};

Venda.Widget.RegionLangSwitch.changeRegionLang = function(selectedObj,type){
	splitText = jQuery(selectedObj).attr("rel").split(" ");
	if(type == 'region'){
		jQuery(".currency a").removeClass("selected");
		jQuery(".regionLangSwitchContent").find("#txtswitchcur").addClass("selected");
	}
	if(type == 'lang'){
		jQuery(".contentLlanguage a").removeClass("selected");
		jQuery(".regionLangSwitchContent").find("#txtswitchlang").addClass("selected");
	}
	jQuery(selectedObj).addClass("selected");
	
	if(jQuery("#txtswitchcur").hasClass("selected") && jQuery("#txtswitchlang").hasClass("selected")){
		jQuery(".rLSwitchSubmit").addClass("selectDone");
	}
	 if(jQuery("#txtswitchcur").hasClass("login") && jQuery("#txtswitchlang").hasClass("selected")){
		jQuery(".rLSwitchSubmit").addClass("selectDone");
	}
 };
 
 Venda.Widget.RegionLangSwitch.changeRegionLangSubmit = function(selectedObj){
	/*if(chRegion == ""){ chRegion = currRegion; }
	if(chLang == ""){ chLang = currLang; 	} */
	
	jQuery(".currency").find("a").each(function(){
		if(jQuery(this).hasClass("selected")){
			chRegion = jQuery(this).attr("rel");
		}
	});
	jQuery(".contentLlanguage").find("a").each(function(){
		if(jQuery(this).hasClass("selected")){
			chLang = jQuery(this).attr("rel");
		}
	});

	if((chRegion != "") && (chLang != "")){
	Venda.Widget.RegionLangSwitch.doURL(currRegion,chRegion,workflow,'setlocn');
	Venda.Widget.RegionLangSwitch.doURL(currLang,chLang,workflow,'setlang');	
	}

 };

 Venda.Widget.RegionLangSwitch.doURL = function(repVal,newRepVal,workflow,chType){
	var rep = "/"+repVal+"/";
	var newRep = "/"+newRepVal +"/"; 
	var redirectURL = sURL;
	var bsref = jQuery("#tag-bsref").html();
	
	if(chRegion == ""){ chRegion = currRegion; }
	if(chLang == ""){ chLang = currLang; }	

	if(sURL.indexOf(rep) > -1){
		sURL = sURL.replace(rep, newRep);
		redirectURL = sURL;			
	}
	else if((sURL.indexOf(rep) < 0) && (workflow == 'locayta')){
		if((sURL.indexOf("setlang") > -1) || (sURL.indexOf("setlocn") > -1) ) { 
			var repStr = chType+"="+repVal;
			var newRepStr = chType+"="+newRepVal;
			sURL = sURL.replace(repStr, newRepStr);
			redirectURL = sURL; 
		}else{
			redirectURL = sURL+"&setlang="+chLang+"&setlocn="+chRegion;
		}

		var reg = new RegExp('[?&]datasource=([^&]+)');
		redirectURL = redirectURL.replace(redirectURL.match(reg)[0], "&datasource="+bsref+chLang);
	}
	else{ 
		redirectURL = jQuery("#ebizurl").html()+"/"+chLang+"/"+chRegion+"/page/home";
	}
	
	var attributeColor = Venda.Platform.getUrlParam(document.location.href,"colour");
	if(attributeColor){redirectURL=redirectURL.replace("colour="+attributeColor, "colour="+escape(attributeColor));}
	
	window.location.href = redirectURL;
	
};


