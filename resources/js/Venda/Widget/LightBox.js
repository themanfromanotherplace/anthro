/**
 * @fileoverview Venda.Widget.LightBox - Create an inpage popup using an iframe.
 *
 * The information displayed in a div element which is retrieved using AJAX. This information can
 * be a flash movie or a static image.
 * 
 * @requires /venda-support/js/external/yui/build/yahoo-dom-event/yahoo-dom-event.js  
 * @requires /venda-support/js/external/yui/build/dragdrop/dragdrop-min.js
 * @requires /venda-support/js/external/yui/build/container/container-min.js
 * @requires /venda-support/js/external/yui/build/connection/connection-min.js
 * @requires /venda-support/js/ajax.js
 * @requires /venda-support/js/external/swfobject.js
 * @requries resources/css/external/yui/container-skin.css
 * @author Aron San <asan@venda.com>
 */

//create LightBox namespace
Venda.namespace('Widget.Lightbox');

/**
 * Stub function is used to support JSDoc.
 * @class Venda.Widget.Lightbox
 * @constructor
 */
Venda.Widget.Lightbox = function(){};

/**
 * Temporary container to hold lightbox content - used to get lightbox content dimensions before displaying
 */
Venda.Widget.Lightbox.tempContainer = 'tempLightbox';

//declare the variables 
Venda.Widget.Lightbox.config = {
	flLink: null,
	staticLink: null,
	drag: null,
	modal: null,
	fixedCenter: null,
	fade: null,
	underlay: null,
	flSource: null,
	flId: null,
	flContainer: null,
	flWidth: null,
	flHeight: null,
	flVer: null,
	flBgColour: null,
	flWmode: null,
	divholdername: null,
	divname: null,
	showheader: null,
	invtname: null,
	redirect: null,
	hrefPath: null,
	loadmessage: null,
	isOpen: false
};

/**
* Sets the config values to each config type
* @param {string} configType this is an configuration type name
* @param {array} settings this is the value of each configuration type
*/
Venda.Widget.Lightbox.init = function(setting) {
	for (var eachProp in setting) {
		this.config[eachProp] = setting[eachProp];
	}
};

/**
 * Create a new lightbox object
 * @param {array} 	zoomHook specify which anchors will trigger a flash lightbox
 * @param {array} 	largeImgHook specify which anchors will trigger a image lightbox
 * @param {object} 	settings set settings for lightbox:
 *		- panel settings - draggable:boolean, modal:boolean, fixedCenter: boolean, fade: duration (in a whole or decimial number), underlay: string 
 * 		- flash settings - flSource:string (url), flContainer:element which will hold the flash, flWidth:String, flHeight:String, flVer:Int , flBgColour:String (hexadecimal)
 * @tags {object} 	tags pass venda tags into js functions (invtname:string, redirect:string, loadmessage:string)
*/	
Venda.Widget.Lightbox.create = function(zoomHook, largeImgHook, settings, tags) {
	if ((typeof zoomHook != "undefined") && (typeof largeImgHook!= "undefined") && (typeof settings != "undefined") && (typeof tags!= "undefined")) {
		// Used for LIVE site
		this.init({
			flLink: zoomHook,
			staticLink: largeImgHook,
			drag: settings.drag, modal: settings.modal, fixedCenter: settings.fixedCenter, fade: settings.fade,
			flSource: settings.flSource,
			flId: settings.flId, flContainer: settings.flContainer, flWidth: settings.flWidth, flHeight: settings.flHeight, flVer: settings.flVer, flBgColour: settings.flBgColour,
			invtname: tags.invtname,
			redirect: tags.redirect,
			loadmessage: tags.loadmessage
		});
		
		if (!this.config.divholdername) {this.config.divholdername = 'lightbox_holder';}
		if (!this.config.divname) {this.config.divname = 'lightboxcontent_panel';}
		if (!this.config.showheader) {this.config.showheader = true;}
		if (!this.config.flWmode) {this.config.flWmode = 'transparent';}
		if (!this.config.underlay) {this.config.underlay = 'shadow';}
		YAHOO.util.Event.addListener(this.config.flLink, "click", Venda.Widget.Lightbox.showImageware);
		YAHOO.util.Event.addListener(this.config.staticLink, "click", Venda.Widget.Lightbox.showLargeImg);
	}
	// 'flId' will be assigned an id dynamically if it's null value
	if(this.config.flId == null) {this.config.flId = "lightboxflash";};
		
	//window onload events
	YAHOO.util.Event.addListener(window, "load", Venda.Widget.Lightbox.loadingPanel);
	YAHOO.util.Event.addListener(document, "keydown", Venda.Widget.Lightbox.handleKeyPress);
};

/**
 * Render flash movie using a flash detection script
 * @param {string} redirectTo a URL to redirect the user to if flash has not been detected successfully
 * @param {string} targetElem a target HTML element for the flash to be placed in
 */
Venda.Widget.Lightbox.renderFlash = function() {
	var flParams = { wmode: this.config.flWmode, bgcolor: this.config.flBgColour };
	var flVars = { width: this.config.flWidth, height: this.config.flHeight, loop: false, quality: 'autohigh'};
	var flAttributes = { id: this.config.flId };

	swfobject.embedSWF(this.config.flSource, this.config.flContainer, this.config.flWidth, this.config.flHeight, this.config.flVer, false, flVars, flParams, flAttributes);	
	Venda.Widget.Lightbox.config.isOpen = true;
};

/**
 * Show flash movie
 * A flash movie is displayed in a lightbox where the source of the movie is retrieved using AJAX 
 * @param {event} e used to suppress default link behaviour
 */
Venda.Widget.Lightbox.showImageware = function() {
	//YAHOO.util.Event.preventDefault();	// suppress default link behaviour
	Venda.Widget.Lightbox.wait.show();
	
	ajaxFunction(Venda.Widget.Lightbox.config.hrefPath + '&layout=lightbox', Venda.Widget.Lightbox.tempContainer, undefined, function() {
		Venda.Widget.Lightbox.renderFlash();
		Venda.Widget.Lightbox.popupContent = document.getElementById(Venda.Widget.Lightbox.tempContainer).innerHTML;
		
		//clear content of tempLightbox so that initial positioning of lightbox is not affected
		document.getElementById(Venda.Widget.Lightbox.tempContainer).innerHTML = "";
		
		//calling popupInvtContent() more than onces removes panel settings e.g. draggable
		if (!Venda.Widget.Lightbox.imagePanel) {
			Venda.Widget.Lightbox.popupInvtContent();
		} else {
			Venda.Widget.Lightbox.imagePanel.setBody('<div class="lightBoxContent" class="lightBoxContentExtra">'+Venda.Widget.Lightbox.popupContent+'</div>');
		}
		
		//set dimensions - this is required for the lightbox header to appear correctly on IE
		var lightBoxElem = document.getElementById(Venda.Widget.Lightbox.config.divname);
		Venda.Widget.Lightbox.setContentDimensions(lightBoxElem);
		Venda.Widget.Lightbox.wait.hide();
		Venda.Widget.Lightbox.imagePanel.show();
		YAHOO.util.Event.addListener('closelightbox', 'click', Venda.Widget.Lightbox.lightboxHide, Venda.Widget.Lightbox.imagePanel, true);
		
		//hide lightbox header if 'config.showheader' is true
		if(!Venda.Widget.Lightbox.config.showheader) {
			jQuery("#"+Venda.Widget.Lightbox.config.divholdername+" .hd").hide();
		} else {
			jQuery("#"+Venda.Widget.Lightbox.config.divholdername+" .hd").show();
		}
	});
};

/**
 * Show image in lightbox
 * A image is displayed in a lightbox where the source of the image is retrieved using AJAX 
 * @param {event} e used to suppress default link behaviour
 */
Venda.Widget.Lightbox.showLargeImg = function(e) {
	YAHOO.util.Event.preventDefault(e); // suppress default link behaviour
	Venda.Widget.Lightbox.wait.show();
	
	ajaxFunction(this.href + '&layout=lightbox', Venda.Widget.Lightbox.tempContainer, undefined, function () {
		var tempLb = document.getElementById(Venda.Widget.Lightbox.tempContainer);
		Venda.Widget.Lightbox.popupContent = tempLb.innerHTML;
		//clear content of tempLightbox so that initial positioning of lightbox is not affected
		tempLb.innerHTML = "";
		
		//calling popupInvtContent() more than onces removes panel settings e.g. draggable 
		if (!Venda.Widget.Lightbox.imagePanel) {
			Venda.Widget.Lightbox.popupInvtContent();
			Venda.Widget.Lightbox.config.isOpen = true;
		} else {
			Venda.Widget.Lightbox.imagePanel.setBody('<div class="lightBoxContent" class="lightBoxContentExtra">'+Venda.Widget.Lightbox.popupContent+'</div>');
			Venda.Widget.Lightbox.config.isOpen = true;
		}
		//set dimensions - this is required for the lightbox header to appear correctly on IE
		var lightBoxElem = document.getElementById(Venda.Widget.Lightbox.config.divname);
		Venda.Widget.Lightbox.setContentDimensions(lightBoxElem);
	
		Venda.Widget.Lightbox.wait.hide();
		Venda.Widget.Lightbox.imagePanel.show();
		YAHOO.util.Event.addListener('closelightbox', 'click', Venda.Widget.Lightbox.lightboxHide, Venda.Widget.Lightbox.imagePanel, true);
	});
};

/**
 * Initialise lightbox loading panel
 * Creates a div container which will display a loading message
 */
Venda.Widget.Lightbox.loadingPanel = function () {
	waitPanel = new YAHOO.widget.Panel("wait_panel", { fixedcenter: true, close: false, draggable: false, modal: true, visible: false, effect:{effect:YAHOO.widget.ContainerEffect.FADE,duration: Venda.Widget.Lightbox.config.fade} } );
	waitPanel.setHeader('<div class="tl"></div><span>'+Venda.Widget.Lightbox.config.loadmessage+'</span><div class="tr"></div>');
	waitPanel.setBody('<span id="loadPanelImg" class="loadPanelImgExtra"></span>');
	waitPanel.render(document.body);
	Venda.Widget.Lightbox.wait = waitPanel; //assign so it can be used within the namespace
};

/**
 * Initialise lightbox panel
 * Creates div containers which will display the lightbox contents and renders the lightbox
 */
Venda.Widget.Lightbox.popupInvtContent = function() {
	//create lightbox_holder - this needs to be a direct decendent of the body tag for modal option to work in IE
	var lightboxDiv = document.createElement("div");
	lightboxDiv.setAttribute('id',this.config.divholdername);
	document.body.appendChild(lightboxDiv);

	// Instantiate a Panel from script
	var imagePanel = new YAHOO.widget.Panel(Venda.Widget.Lightbox.config.divname, { draggable: Venda.Widget.Lightbox.config.drag, modal: Venda.Widget.Lightbox.config.modal, fixedcenter: Venda.Widget.Lightbox.config.fixedCenter, constraintoviewport:true, visible: false, close: true, effect:{effect:YAHOO.widget.ContainerEffect.FADE,duration: Venda.Widget.Lightbox.config.fade}, underlay: Venda.Widget.Lightbox.config.underlay } );
	imagePanel.setHeader('<div class="tl"></div><span>'+ Venda.Widget.Lightbox.config.invtname +'</span><div class="tr"></div>');
	imagePanel.setBody('<div class="lightBoxContent" class="lightBoxContentExtra">'+Venda.Widget.Lightbox.popupContent+'</div>');
	imagePanel.render(Venda.Widget.Lightbox.config.divholdername);
	imagePanel.hideEvent.subscribe(Venda.Widget.Lightbox.cleanUp);
	Venda.Widget.Lightbox.imagePanel = imagePanel; //assign so it can be used within the namespace
};

/**
 * Get content dimensions and set CSS style width and height properties accordingly
 * @param {String} lightBoxId	the id of element to get dimensions from
 * @returns {object} dimensions containing width and height
 */
Venda.Widget.Lightbox.setContentDimensions = function(lightBoxId) {
	var dimensions = { cWidth: lightBoxId.offsetWidth, cHeight: lightBoxId.offsetHeight };	
	lightBoxId.style.width = dimensions.cWidth;
	lightBoxId.style.height = dimensions.cHeight;
	return dimensions;
};

/**
 * Hide lightbox popup and clean up
 */
Venda.Widget.Lightbox.lightboxHide = function(e) {
	YAHOO.util.Event.preventDefault(e); // suppress default link behaviour
	Venda.Widget.Lightbox.imagePanel.hide();
	Venda.Widget.Lightbox.cleanUp();
};

/**
 * Clean up
 * Remove eventListener and other clean up tasks
 */
Venda.Widget.Lightbox.cleanUp = function() {
	YAHOO.util.Event.removeListener('closelightbox', 'click');
	// hide flash - issue with swfobject detection script
	var iw = document.getElementById(this.config.flId);
	if (iw){iw.style.visibility = 'hidden'; }
};

Venda.Widget.Lightbox.handleKeyPress = function (e) {
	if (Venda.Widget.Lightbox.config.isOpen) {
		if (e.keyCode === 27) {
			Venda.Widget.Lightbox.config.isOpen = false; //reset flag
			Venda.Widget.Lightbox.lightboxHide(e);
		}
	}
};