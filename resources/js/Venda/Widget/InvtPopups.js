/**
 * @fileoverview Venda.Widget.InvtPopups - Create an inpage popup for common features such as tell a friend, emwbis, write and read a review.
 *
 * The information displayed in the popup div is retrieved using AJAX. This information is pulled
 * from the usual invt template used for the standard tell a friend, emwbis, write and read a review functionality.
 * 
 * @requires /venda-support/js/ajax.js
 * @requires /venda-support/js/external/yui/build/yahoo/yahoo-min.js
 * @requires /venda-support/js/external/yui/build/dom/dom-min.js
 * @requires /venda-support/js/external/yui/build/event/event-min.js
 * @requires /venda-support/js/external/yui/build/connection/connection-min.js
 * @requires /venda-support/js/external/yui/build/yahoo-dom-event/yahoo-dom-event.js  
 * @requires /venda-support/js/external/yui/build/dragdrop/dragdrop-min.js
 * @requires /venda-support/js/external/yui/build/container/container-min.js
 * @author Hayley Easton <heaston@venda.com>
 */

//create InvtPopups namespace
Venda.namespace('Widget.InvtPopups');

/**
 * Stub function is used to support JSDoc.
 * @class Venda.Widget.InvtPopups
 * @constructor
 */
Venda.Widget.InvtPopups = function(){};

/**
 * Construct a new features object
 * @param {array} 	featureHook specify which anchors will trigger the popups
 * @param {object} 	settings set settings for features (draggable: boolean, modal:boolean, fixedCenter: boolean, fade: duration (in a whole or decimal number) )
 * @tags {object} 	tags pass venda tags into js functions (loadmessage:string)
 */	
Venda.Widget.InvtPopups.create = function(featureHook, settings, tags) {
	Venda.Widget.InvtPopups.settings = settings;
	Venda.Widget.InvtPopups.tags = tags;
	
	//register listener for objects in 'featureHook' array
	YAHOO.util.Event.addListener(featureHook, "click", Venda.Widget.InvtPopups.interceptLink);
	
	//window onload events
	YAHOO.util.Event.addListener(window, "load", Venda.Widget.InvtPopups.popupInvtFeature);
};

/**
 * Show product detail feature panel
 * Will show/hide generated feature popup
 * @param {event} e used to suppress default link behaviour
 */
Venda.Widget.InvtPopups.interceptLink = function(e) {
	YAHOO.util.Event.preventDefault(e); // suppress default link behaviour
	// If the link clicked has rel attributes e.g. rel="390 180", use the values provided to set the width and height of the popup div
	// If no rel attributes are provided at all, the css will control the width & height
	// If one link uses the rel attributes, it is best to provide rel attributes to all links
	var relEl = document.getElementById(this.id).rel.split(" ");
	if (relEl[0]) {
		YAHOO.util.Dom.setStyle('popupcontent_panel', 'width', relEl[0]+'px');
	};
	
	if (relEl[1]) {
		YAHOO.util.Dom.setStyle('popupcontent', 'height', relEl[1]+'px');
	};

	var tl = '<div class="tl"></div><span>'; // optional top left curve
	var tr = '</span><div class="tr"></div>'; // optional top right curve
	htmlEl = document.getElementById(this.id);
	
	hasHeaderID = document.getElementById(this.id+'_header');
	if(hasHeaderID){
		// If there is an ID in the productdetail to use for the header, use it
		headerEl = document.getElementById(this.id+'_header').innerHTML;
	} else {
		// If there no ID in the productdetail use the HTML within the <a></a> tags that called the popup
		headerEl = htmlEl.innerHTML;
	}
	
	featurePanel.setHeader(tl + headerEl + tr); // set heading of popup div
	featurePanel.show(); // show popup div
	ajaxFunction(this.href+'&layout=noheaders','popupcontent',null,Venda.Widget.InvtPopups.callback); //fill div with relevant content via ajax
};

/**
 * After ajaxFuntion finished this function will be active and call:
 * - if InvtPopups.settings.fixedCenter=true, set new center to YUI panel
 *  - Venda.Widget.InvtPopups.loadInvtScript
 */
Venda.Widget.InvtPopups.callback=function(){
	/* prevent fixCenter = false or "contained" */
	if(Venda.Widget.InvtPopups.settings.fixedCenter===true){
		featurePanel.doCenterOnDOMEvent();
	}
	Venda.Widget.InvtPopups.loadInvtScript();
};

/**
 * Insert javascript
 * Adds an external javascript tag to the main page so that javascript belonging to popup will run
 */
Venda.Widget.InvtPopups.loadInvtScript = function() {
	//only load script if the popup contains an invt template
	if (htmlEl.href.match('/invt')!=null){
		insertScript(htmlEl.href+'_script&layout=noheaders','popupcontent');
	}
};

/**
 * Initialise product detail features panel
 * Creates div containers which will display either tell a friend, emwbis, read or write a review
 */
Venda.Widget.InvtPopups.popupInvtFeature = function() {
	// Instantiate a Panel from script
	featurePanel = new YAHOO.widget.Panel("popupcontent_panel", { constraintoviewport: true, visible: false, draggable: Venda.Widget.InvtPopups.settings.drag, modal: Venda.Widget.InvtPopups.settings.modal, fixedcenter: Venda.Widget.InvtPopups.settings.fixedCenter, effect:{effect:YAHOO.widget.ContainerEffect.FADE,duration: Venda.Widget.InvtPopups.settings.fade}, x:Venda.Widget.InvtPopups.settings.x } );
	featurePanel.setBody("<div id='popupcontent'><p>" + Venda.Widget.InvtPopups.tags.loadmessage + "</p></div>");
	featurePanel.render("invt_popup");
	featurePanel.hideEvent.subscribe(Venda.Widget.InvtPopups.emptyContent);
};

/**
 * Hide features popup
 * Closes the popup if 'Back to Product Details' link is clicked
 */
Venda.Widget.InvtPopups.featureHide = function(e) {
	YAHOO.util.Event.preventDefault(e); // suppress default link behaviour
	featurePanel.hide();
};

/**
 * Reset popup contents
 * When popup is closed, reset the contents so loading message appears
 */
Venda.Widget.InvtPopups.emptyContent = function(e) {
	document.getElementById('popupcontent').innerHTML = "<p>" + Venda.Widget.InvtPopups.tags.loadmessage + "</p>";
};

//Legacy support - allows calls to function that predate Venda namespacing to work
featureHide = Venda.Widget.InvtPopups.featureHide;
features = Venda.Widget.InvtPopups;
Venda.Widget.Features = Venda.Widget.InvtPopups;