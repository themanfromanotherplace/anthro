if(Venda.Widget.MinicartPopup != "undefined"){

Venda.Widget.MinicartPopup.addProduct = function(e) {
	YAHOO.util.Event.stopEvent(e); // suppress form submit
	
	/* prevent from invalid attribute */
	if (typeof Venda.Ebiz.AttributeSwatch.validateAttributes != "undefined"){
		if(!Venda.Ebiz.AttributeSwatch.validateAttributes()){return false;}
	}
	
	// animation variables to send to UpdateMinicart.js
	// if this variable is blank, then no colour animation will occur
	if (Venda.Widget.MinicartPopup.tags.fromcolor != "" && Venda.Widget.MinicartPopup.tags.frombgrcolor == ""){
		var minicartColors = {
	        color: { from: Venda.Widget.MinicartPopup.tags.fromcolor, to: Venda.Widget.MinicartPopup.tags.tocolor }
	    };
	}else if (Venda.Widget.MinicartPopup.tags.fromcolor == "" && Venda.Widget.MinicartPopup.tags.frombgrcolor != ""){
		var minicartColors = {
	        backgroundColor: { from: Venda.Widget.MinicartPopup.tags.frombgrcolor, to: Venda.Widget.MinicartPopup.tags.tobgrcolor }
	    };
	}else if (Venda.Widget.MinicartPopup.tags.fromcolor != "" && Venda.Widget.MinicartPopup.tags.frombgrcolor != ""){
		var minicartColors = {
	        color: { from: Venda.Widget.MinicartPopup.tags.fromcolor, to: Venda.Widget.MinicartPopup.tags.tocolor },
			backgroundColor: { from: Venda.Widget.MinicartPopup.tags.frombgrcolor, to: Venda.Widget.MinicartPopup.tags.tobgrcolor }
	    };
	}else {var minicartColors = "";}
	
	highlightItems = new YAHOO.util.ColorAnim('updateItems', minicartColors, Venda.Widget.MinicartPopup.tags.fromtoduration);
	highlightTotal = new YAHOO.util.ColorAnim('updateTotal', minicartColors, Venda.Widget.MinicartPopup.tags.fromtoduration);
	
	// find out which form ID was submitted
	if (this.id="qty") { this.id = "addproduct";}
	clickedID = this.id;
	formID = clickedID+'form';
	
	// find original source so you can restore it, make this variable global so UpdateMinicart.js can use it
	var buttonID = document.getElementById(clickedID);
	originalsrc = buttonID.src;
	buttonID.src='/content/ebiz/'+ Venda.Widget.MinicartPopup.tags.bsref +'/resources/images/'+ Venda.Widget.MinicartPopup.tags.seslang +'/bt_pleasewait.gif'; // change the add to basket image so the user knows something is happening
	
	// change layout field so that the response loaded in the div shows the relevant message
	document.getElementById(formID).layout.value = 'cartresponse';
	if(typeof document.getElementById(formID).curlayout != 'undefined'){
		// if there is a curlayout field change the value to cartresponse
		document.getElementById(formID).curlayout.value = 'cartresponse';
	};
	Venda.Widget.MinicartPopup.panelHeight = document.getElementById('popupcart_panel').offsetHeight; // original height of popup before cart updated

	Venda.Ebiz.ajaxFunction(Venda.Widget.MinicartPopup.tags.formaction,'addedmsg',formID, function() {
		//leave this as an inserted script as it relies on loaded IDs from invt/addtocart_response
		insertScript('/venda-support/js/Venda/Widget/UpdateMinicart.js',formID);
		// now update and open the minicart, in that order
		ajaxFunction('/page/home&layout=minicart_detail','popupcart', undefined, function() { //we update cartwrapper so that static minicart detail will update
			if (Venda.Widget.MinicartPopup.windowsettings.milliseconds != ""){
				// reset the timer if automatic close is enabled
				clearTimeout(popupTimerId);
			};
			Venda.Widget.MinicartPopup.openAnim();
			Venda.Widget.MinicartPopup.highlightAdded();
			// reset form fields that were set by JS
			document.getElementById(formID).layout.value = '';
			document.getElementById(formID).ex.value = 'co_wizr-shopcart';
			if (typeof Venda.Widget.CurrencyConverter != "undefined" || Venda.Widget.CurrencyConverter) {
				Venda.Widget.CurrencyConverter.GetCookie();
			};
		});
	});
};

}else{
	
	throw("Cannot overide minicart functions for product set");
}