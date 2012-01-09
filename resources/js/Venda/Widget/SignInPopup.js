/**
 * @fileoverview Venda.Widget.SignInPopup - Create an inpage popup for logging in or registration.
 *
 * The information displayed in the popup div is retrieved using AJAX. This information is pulled
 * from the usual invt template used for the standard tell a friend, emwbis, write and read a review functionality.
 * 
 * @requires /venda-support/js/ajax.js
 * @requires /venda-support/js/external/yui/build/utilities/utilities.js
 * @requires /venda-support/js/external/yui/build/container/container-min.js
 * @author Hayley Easton <heaston@venda.com>
 */

//create SignInPopup namespace
Venda.namespace('Widget.SignInPopup');

/**
 * Stub function is used to support JSDoc.
 * @class Venda.Widget.SignInPopup
 * @constructor
 */
Venda.Widget.SignInPopup = function(){};

/**
 * Construct a new sign in object
 * @param {array} 	hooks specify which anchors will trigger the popups
 * @param {object} 	settings set settings for features (header: string, drag:boolean, modal:boolean, fixedCentre: boolean, fade: duration (in a whole or decimal number), width: duration (in a whole or decimal number), footer:string )
 * @tags {object} 	tags pass venda tags into js functions (signinheading:string, pwrmheading:string, bsref:string, updateloginlinks:string, forgottenpassword:string, activecontent:string, defaultsignin:string)
 */	
Venda.Widget.SignInPopup.create = function(hooks, settings, tags) {
	Venda.Widget.SignInPopup.settings = settings;
	Venda.Widget.SignInPopup.tags = tags;
	
	//register listener for objects in 'hooks' array
	YAHOO.util.Event.addListener(hooks, "click", Venda.Widget.SignInPopup.interceptloginLink);
	
	//window onload events
	YAHOO.util.Event.addListener(window, "load", Venda.Widget.SignInPopup.buildPanel);

};

var signInPanelIframeLoaded = false;
var signInPanelLoaded = false;

/**
 * Initialise signin panel
 * Creates div containers which will display the signin contents
 */
Venda.Widget.SignInPopup.buildPanel = function() {
	// Instantiate a Panel from script
	signInPanel = new YAHOO.widget.Panel("signin_panel", { 
		width : Venda.Widget.SignInPopup.settings.width+"px",
		underlay: "none", //should be removed when YUI upgraded which fixes current bug with IE
		constraintoviewport: true, 
		visible: false, 
		draggable: Venda.Widget.SignInPopup.settings.drag, 
		modal: Venda.Widget.SignInPopup.settings.modal, 
		fixedcenter: Venda.Widget.SignInPopup.settings.fixedCentre, 
		effect:{effect:YAHOO.widget.ContainerEffect.FADE,duration: Venda.Widget.SignInPopup.settings.fade} } 
	);
	
	if (Venda.Widget.SignInPopup.settings.header != "" || Venda.Widget.SignInPopup.settings.drag != ""){
		signInPanel.setHeader('<div class="tl"></div><span>'+Venda.Widget.SignInPopup.tags.signinheading+'</span><div class="tr"></div>'); // set heading of popup div
	}
	signInPanel.setBody('<div id="signInPanelBody"><div id="signInPanelIframeLoading"><span id="loadPanelImg" class="loadPanelImgExtra"></span></div></div>');
	
	if (Venda.Widget.SignInPopup.settings.footer != ""){
		signInPanel.setFooter(Venda.Widget.SignInPopup.tags.forgottenpassword + Venda.Widget.SignInPopup.tags.activecontent + Venda.Widget.SignInPopup.tags.defaultsignin);
	}
	
	//create signin_popup - this needs to be a direct decendent of the body tag for modal option to work (IE bug)
	var signinDiv = document.createElement("div");
	signinDiv.setAttribute('id','signin_popup');
	document.body.appendChild(signinDiv);
	
	// Render, add open event
	signInPanel.render("signin_popup");
	signInPanel.beforeShowEvent.subscribe( Venda.Widget.SignInPopup.sihandleOpen, signInPanel, true );
	signInPanel.hideEvent.subscribe(Venda.Widget.SignInPopup.sihandleClose);
};

/**
 * Generate iframe
 * Will show signin inside an iframe so co_comn-login JavaScript can be used
 * and so we can talk to parent regardless of differing protocols
 */
Venda.Widget.SignInPopup.sihandleOpen = function() {
	// If the iframe is loaded already, we can skip out.
	if ( signInPanelIframeLoaded ) { return; }
	
	/**** LOAD IFRAME ****/

	// Set onAvailable event to remove loading image
	YAHOO.util.Event.onAvailable('signInPanelIframe1', Venda.Widget.SignInPopup.signInIframeLoaded);
	
	// reset header
	signInPanel.setHeader('<div class="tl"></div><span>'+Venda.Widget.SignInPopup.tags.signinheading+'</span><div class="tr"></div>'); // set heading of popup div
	
	// create iFrame
	var iFrame;
	iFrame = document.createElement("iframe");
	iFrame.setAttribute("src", '\/page/signiniframe');
	iFrame.setAttribute("scrolling", "auto");
	iFrame.setAttribute("frameBorder", "0"); 
	iFrame.setAttribute("id", 'signInPanelIframe1'); 
	iFrame.setAttribute("class", "signinpanelsecure"); // for firefox
	iFrame.setAttribute("className", "signinpanelsecure"); // For IE

	// Load it into panel
	document.getElementById('signInPanelBody').appendChild(iFrame);

	signInPanelIframeLoaded = true;
	signInPanelLoaded = true;
};

/**
 * Close signin popup
 */
Venda.Widget.SignInPopup.sihandleClose = function() {
	// if the popup was closed while viewing password reminder, set the body back to the loading stage
	if (!signInPanelIframeLoaded){
		signInPanel.setBody('<div id="signInPanelBody"><div id="signInPanelIframeLoading"><span id="loadPanelImg" class="loadPanelImgExtra"></span></div></div>');
	};
	signInPanelLoaded = false;
};

/**
 * Replace loading image
 * Removes loading image from signIn Panel body [once its loaded]
 */
Venda.Widget.SignInPopup.signInIframeLoaded = function(arg) {
	// Remove loading image
	var body = document.getElementById('signInPanelBody');
	for (var i = 0; i < body.childNodes.length; i++) {
		var child = body.childNodes[i];
		if( child.id && child.id == 'signInPanelIframeLoading' ) {
			body.removeChild(child);
			break;
		}
	}
};

/**
 * Update standard items that change when ustype=R
 */
Venda.Widget.SignInPopup.signInCallback = function() {
	signInPanel.hide();
	// don't bother updating all the logged in areas if we clicked My Account, just redirect to My Account page
	if(clickedId == "Lustype_myacclink"){
		window.location.href = "/page/myaccount";
	}else{
		//update minicart figures if the ids exist
		if(document.getElementById('updateItems')){
			ajaxFunction('/page/ajax_items','updateItems');
		}
		if(document.getElementById('updateTotal')){
			ajaxFunction('/page/ajax_total','updateTotal');
		}
		//update welcomemessage if there is a welcome id
		if(document.getElementById('welcome')){
			ajaxFunction('/page/welcomemessage','welcome');
		}
		// update login link if there is a ustypelinks id
		var ustypeLinks = document.getElementById('ustypelinks');
		if(ustypeLinks){
			ustypeLinks.innerHTML = Venda.Widget.SignInPopup.tags.updateloginlinks;
			jQuery('li.myaccount').load("/page/ajax_myaccount");
		}
		//Reload switcher
		if (document.getElementById('selectCur')) {
			ajaxFunction('/page/currencyconversion','selectCur');
		}
		// update minicart detail and/or popup if there is one
		if(document.getElementById('cartwrapper')){
			ajaxFunction('/page/home&layout=minicart_detail','cartwrapper', undefined, function() { //we update cartwrapper so that static minicart detail will update
				// regenerate panel body now that user is logged in if using minicart popup
				if(document.getElementById('minicart_element')){
					minicartPanel.setBody('<div id="popupcart">'+ document.getElementById('cartwrapper').innerHTML +'</div>');
					productsHeightDiff = document.getElementById('cartwrapper').offsetHeight;// height of popup once cart updated
				}
			});
		}
	}
};

/**
 * Show signin panel
 * Will show generated signin popup
 * @param {event} e used to suppress default link behaviour
 */
Venda.Widget.SignInPopup.interceptloginLink = function(e) {
	YAHOO.util.Event.preventDefault(e); // suppress default link behaviour
	clickedId = this.id;
	if (!signInPanelIframeLoaded && signInPanelLoaded){
		signInPanel.setBody('<div id="signInPanelBody"><div id="signInPanelIframeLoading"><span id="loadPanelImg" class="loadPanelImgExtra"></span></div></div>');
		Venda.Widget.SignInPopup.sihandleOpen();
	};
	signInPanel.show();
	Venda.Widget.RegionLangSwitch.closeDialog();
};

/**
 * Password reminder
 * Will show password reminder form inside signin popup using AJAX
 * Loads specific script for the password reminder
 */
Venda.Widget.SignInPopup.interceptpwrmLink = function() {
	signInPanelIframeLoaded = false;
	if (window.location.protocol == "http:"){
	// update the header title to the specified text in the element
	signInPanel.setHeader('<div class="tl"></div><span>'+Venda.Widget.SignInPopup.tags.pwrmheading+'</span><div class="tr"></div>'); // set heading of popup div
	ajaxFunction('/bin/venda?ex=co_wizr-passwordreminder&layout=noheaders&bsref='+Venda.Widget.SignInPopup.tags.bsref,'signInPanelBody',null,function() {
		insertScript('/venda-support/js/Venda/Widget/SignInPwrm.js','signInPanelBody');
		}
	);
	}else{
	// password reminder cannot be loaded from a secure parent without returning a 302 message
	// so break out of popup and load in parent
	window.location.href = document.getElementById('passcode').href;
	}
};

/**
 * Reloads iframe
 * If on password reminder and previous button is clicked
 * requires a reload of the original signin iframe
 */
Venda.Widget.SignInPopup.reloadIframe = function(e) {
	YAHOO.util.Event.preventDefault(e); // suppress default link behaviour
	signInPanelIframeLoaded = false;
	document.getElementById('signInPanelBody').innerHTML = "";
	Venda.Widget.SignInPopup.sihandleOpen();
};