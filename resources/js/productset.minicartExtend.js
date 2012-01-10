/*
 * This file is used in conjunction with the other productset. javascript files
 * in order to handle multiple products on the productset layout for product sets and
 * outfits.
 * 
 * Overides: Venda.Widget.MinicartPopup.addProduct
 */

if(Venda.Widget.MinicartPopup != "undefined"){

Venda.Widget.MinicartPopup.addProduct = function(e) {
	YAHOO.util.Event.stopEvent(e); // suppress form submit
	
	var productAttObj, productObj, invtId, invtForm = document.getElementById( e.currentTarget.form.id );
	
	//try and get the right form
	if( invtForm != "undefined" ){
		
		//get the unique id of the product
		invtId = invtForm.elements["invt"].value;
		
		//get the attribute object for it
		if (typeof productManager.getProductObjectByUniqueId != "undefined"){
			if(!productManager.getProductObjectByUniqueId( invtId )){return false;}
			
			productObj = productManager.getProductObjectByUniqueId( invtId );
			
		};
	
		/* prevent from invalid attribute */
		if (typeof productObj.attributeSwatchInstance.validateAttributes != "undefined"){
			if(!productObj.attributeSwatchInstance.validateAttributes()){return false;}
		}
	
	};
	
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