
//new class for attribute swatch


AttributeSwatchClass = function(){};

AttributeSwatchClass.prototype.config = {};


AttributeSwatchClass.prototype.init = function(userConfig){
	jQuery.extend(this.config, userConfig);
	
	alert(this.config.formHTMLObject);
};



AttributeSwatchClass.prototype.setProductDetailInstance = function(productDetailInstance){
	
	this.productDetailInstance = productDetailInstance;
	
};



AttributeSwatchClass.prototype.productManagerGlobalVariableName = "";


AttributeSwatchClass.prototype.arrg = function(){
	
	alert("aaargg!");
	
};

AttributeSwatchClass.prototype.getProductDetailInstance = function(){
	
	return this.productDetailInstance;
	
};

AttributeSwatchClass.prototype.setProductInstance = function(productInstance){
	
	this.productInstance = productInstance;
};

AttributeSwatchClass.prototype.getProductInstance = function(){
	
	return this.productInstance;
};



AttributeSwatchClass.prototype.ListAttributes = new Array();
AttributeSwatchClass.prototype.filters = new Array();
AttributeSwatchClass.prototype.existingAttributes = new Array();
AttributeSwatchClass.prototype.availAttributes = new Array();
AttributeSwatchClass.prototype.defaultprice = "";
AttributeSwatchClass.prototype.defaultwasprice = "";

AttributeSwatchClass.prototype.initListAttributes = function(attrColumn, attrName) {
	for (var eachKey in this.productInstance.attributeValues) {
		if (typeof this.productInstance.attributeValues[eachKey] != "function") {
			this.addToListAttributes(attrColumn,this.productInstance.attributeValues[eachKey].values[attrColumn]);		
		}
	}
	this.displayListAttributes(attrColumn, attrName);
	if(this.attrNum==1){this.checkAvailOneAttributes(attrColumn, attrName);}
};

AttributeSwatchClass.prototype.addToListAttributes = function(attrColumn, attrValue) {
	if (!this.isExistInListAttributes(attrColumn,attrValue)) {
		if (!this.ListAttributes[attrColumn]) {
			this.ListAttributes[attrColumn] = new Array();
		}
		this.ListAttributes[attrColumn].push(attrValue);

	}
};

AttributeSwatchClass.prototype.isExistInListAttributes = function(attrColumn, attrValue) {
	var found = false;
	if (this.ListAttributes[attrColumn]) {
		for (var eachValue in this.ListAttributes[attrColumn]) {
			if (this.ListAttributes[attrColumn][eachValue] == attrValue) { 			
				found = true; 
				break; 
			}
		}
	}
	return found;
};

AttributeSwatchClass.prototype.createListAttributes=function(attrColumn,attrName,ddObj){
	this.ListAttributes[attrColumn] = new Array();
	for(i=0; i < ddObj.options.length ; i++){
		this.ListAttributes[attrColumn].push(ddObj.options[i].value);
	}
	this.displayListAttributes(attrColumn, attrName);
	if(this.attrNum==1){this.checkAvailOneAttributes(attrColumn, attrName);}
}

AttributeSwatchClass.prototype.displayListAttributes = function (attrColumn, attrName){
	//change so unique 
	var str = "<ul class=attributeList_"+attrColumn+""+this.productDetailInstance.configObjArea["objProductUniqueId"]+" attribute_"+attrColumn+"_"+this.productDetailInstance.configObjArea["objProductUniqueId"]+">";
	var chkString = "";
	
	for(var i=0; i < this.ListAttributes[attrColumn].length; i++){
		// if att=color use image for swatch
		if (attrName == this.attrDisplayName[0] || attrName.toLowerCase() == "currency") {
			if (!this.productDetailInstance.allImages[this.ListAttributes[attrColumn][i]] ||  this.productDetailInstance.allImages[this.ListAttributes[attrColumn][i]].setswatch == "") {

			str += "<li class=\"swatch\"><a class=available id='swatch"+this.ListAttributes[attrColumn][i]+this.productDetailInstance.configObjArea["objProductUniqueId"]+"' title=\""+this.ListAttributes[attrColumn][i]+"\" onmouseover=\"javascript: var instance = " + this.productManagerGlobalVariableName + ".getProductObjectByUniqueId(" + this.productDetailInstance.configObjArea["objProductUniqueId"] + ");  instance.attributeSwatchInstance.showTooltipMessage('swatch"+this.ListAttributes[attrColumn][i]+this.productDetailInstance.configObjArea["objProductUniqueId"]+"');\" onmouseout=\"javascript: var instance = " + this.productManagerGlobalVariableName + ".getProductObjectByUniqueId(" + this.productDetailInstance.configObjArea["objProductUniqueId"] + "); instance.attributeSwatchInstance.hideTooltipMessage();\" onmouseup=\"javascript: var instance = " + this.productManagerGlobalVariableName + ".getProductObjectByUniqueId(" + this.productDetailInstance.configObjArea["objProductUniqueId"] + ");  instance.attributeSwatchInstance.hideTooltipMessage();\" onclick=\"javascript: var instance = " + this.productManagerGlobalVariableName + ".getProductObjectByUniqueId(" + this.productDetailInstance.configObjArea["objProductUniqueId"] + ");  instance.attributeSwatchInstance.actionSet('"+attrColumn+"','"+this.ListAttributes[attrColumn][i]+"'); instance.attributeSwatchInstance.changePrice('attr-sellprice"+this.productDetailInstance.configObjArea["objProductUniqueId"]+"','attr-wasprice"+this.productDetailInstance.configObjArea["objProductUniqueId"]+"'); instance.changeSet('"+this.ListAttributes[attrColumn][i]+"'); return false;\"><span class=\"swatchattribute\">"+this.ListAttributes[attrColumn][i]+"</span></a></li>";					
			} else {
				// has swatch image
				str += "<li class=\"swatch\"><a class=available id='swatch"+this.ListAttributes[attrColumn][i]+this.productDetailInstance.configObjArea["objProductUniqueId"]+"' title=\""+this.ListAttributes[attrColumn][i]+"\" onmouseover=\"javascript: var instance = " + this.productManagerGlobalVariableName + ".getProductObjectByUniqueId(" + this.productDetailInstance.configObjArea["objProductUniqueId"] + ");  instance.attributeSwatchInstance.showTooltipMessage('swatch"+this.ListAttributes[attrColumn][i]+this.productDetailInstance.configObjArea["objProductUniqueId"]+"');\" onmouseout=\"javascript: var instance = " + this.productManagerGlobalVariableName + ".getProductObjectByUniqueId(" + this.productDetailInstance.configObjArea["objProductUniqueId"] + ");  instance.attributeSwatchInstance.hideTooltipMessage();\" onmouseup=\"javascript: var instance = " + this.productManagerGlobalVariableName + ".getProductObjectByUniqueId(" + this.productDetailInstance.configObjArea["objProductUniqueId"] + ");  instance.attributeSwatchInstance.hideTooltipMessage();\" onclick=\"javascript: var instance = " + this.productManagerGlobalVariableName + ".getProductObjectByUniqueId(" + this.productDetailInstance.configObjArea["objProductUniqueId"] + ");  instance.attributeSwatchInstance.actionSet('"+attrColumn+"','"+this.ListAttributes[attrColumn][i]+"'); instance.attributeSwatchInstance.changePrice('attr-sellprice"+this.productDetailInstance.configObjArea["objProductUniqueId"]+"','attr-wasprice"+this.productDetailInstance.configObjArea["objProductUniqueId"]+"'); instance.changeSet('"+this.ListAttributes[attrColumn][i]+"'); return false;\"><img class=\"swatchimage\" src=\""+this.productDetailInstance.allImages[this.ListAttributes[attrColumn][i]].setswatch+"\" alt=\""+this.ListAttributes[attrColumn][i]+"\"></a></li>";
			}

		} else {
			str += "<li><a class=available id='swatch"+this.ListAttributes[attrColumn][i]+this.productDetailInstance.configObjArea["objProductUniqueId"]+"' title=\""+this.ListAttributes[attrColumn][i]+"\" onmouseover=\"javascript: var instance = " + this.productManagerGlobalVariableName + ".getProductObjectByUniqueId(" + this.productDetailInstance.configObjArea["objProductUniqueId"] + ");  instance.attributeSwatchInstance.showTooltipMessage('swatch"+this.ListAttributes[attrColumn][i]+this.productDetailInstance.configObjArea["objProductUniqueId"]+"');\" onmouseout=\"javascript: var instance = " + this.productManagerGlobalVariableName + ".getProductObjectByUniqueId(" + this.productDetailInstance.configObjArea["objProductUniqueId"] + ");  instance.attributeSwatchInstance.hideTooltipMessage();\" onmouseup=\"javascript: var instance = " + this.productManagerGlobalVariableName + ".getProductObjectByUniqueId(" + this.productDetailInstance.configObjArea["objProductUniqueId"] + ");  instance.attributeSwatchInstance.hideTooltipMessage();\" onclick=\"javascript: var instance = " + this.productManagerGlobalVariableName + ".getProductObjectByUniqueId(" + this.productDetailInstance.configObjArea["objProductUniqueId"] + ");  instance.attributeSwatchInstance.actionSet('"+attrColumn+"','"+this.ListAttributes[attrColumn][i]+"'); instance.attributeSwatchInstance.changePrice('attr-sellprice"+this.productDetailInstance.configObjArea["objProductUniqueId"]+"','attr-wasprice"+this.productDetailInstance.configObjArea["objProductUniqueId"]+"'); return false;\">"+this.ListAttributes[attrColumn][i]+"</a></li>";		
		}
	}
	str = str + "</ul>";
	document.getElementById("productdetail-"+attrColumn+this.productDetailInstance.configObjArea["objProductUniqueId"]).innerHTML = str;
};


AttributeSwatchClass.prototype.addFilter = function(attrColumn,attrValue) {
	var filterString="";
	this.filters[attrColumn] = attrValue;
	// clear background alert message
	document.getElementById("alertmessage"+this.productDetailInstance.configObjArea["objProductUniqueId"]).className = "normal";
	// update alert message
	this.updateMessage();
};

AttributeSwatchClass.prototype.updateMessage = function(){
	if(this.attrNum==1){
		if(this.filters["att1"]!=""){
			document.getElementById("alertmessage"+this.productDetailInstance.configObjArea["objProductUniqueId"]).innerHTML = "<span class=labelAttr>" + this.attrDisplayName[0] + ":</span> <span class=colorselected>" + this.filters["att1"]+"</span>";
		}
	}else{
		if(this.filters["att1"]=="" || this.filters["att1"]==undefined){
			document.getElementById("alertmessage"+this.productDetailInstance.configObjArea["objProductUniqueId"]).innerHTML = "<span class=notselectedmsg>"+this.defaultTextSelectAtt + this.attrDisplayName[0] + "</span> <span class=labelAttr>" + this.attrDisplayName[1] + ":</span> <span class=sizeselected>"+ this.filters['att2'] + "</span>";
		}else if(this.filters["att2"]=="" || this.filters["att2"]==undefined){
			document.getElementById("alertmessage"+this.productDetailInstance.configObjArea["objProductUniqueId"]).innerHTML = "<span class=labelAttr>" + this.attrDisplayName[0] + ":</span> <span class=colorselected>" + this.filters['att1'] + "</span> <span class=notselectedmsg>"+this.defaultTextSelectAtt + this.attrDisplayName[1] + "</span>";
		}
		if((this.filters["att1"]!="") && (this.filters["att2"]!="") && (this.filters["att1"]!=undefined) && (this.filters["att2"]!=undefined)){
			document.getElementById("alertmessage"+this.productDetailInstance.configObjArea["objProductUniqueId"]).innerHTML = "<span class=labelAttr>" + this.attrDisplayName[0] + ":</span> <span class=colorselected>" + this.filters["att1"]+"</span> <span class=labelAttr>" + this.attrDisplayName[1] +":</span> <span class=sizeselected>" + this.filters["att2"] + "</span>";
		}
	}
};

AttributeSwatchClass.prototype.validateAttributes = function(){
	var isSelected = true;
	if(this.attrNum==1){
		if(this.filters["att1"]==undefined || this.filters["att1"]==""){
			document.getElementById("alertmessage"+this.productDetailInstance.configObjArea["objProductUniqueId"]).className = "warning";
			isSelected = false;
		}
	}else{
		if(this.filters["att1"]==undefined || this.filters["att2"]==undefined || this.filters["att1"]=="" || this.filters["att2"]==""){
			document.getElementById("alertmessage"+this.productDetailInstance.configObjArea["objProductUniqueId"]).className = "warning";
			isSelected = false;
		}
	}
	return isSelected;
};

// Check if attribute exist and has onhand
AttributeSwatchClass.prototype.checkAvailAttributes = function(attrColumn,attrValue) {
	this.existingAttributes = new Array();
	this.availAttributes = new Array();
	var attrColumnSelect="";
	switch(attrColumn){
		case "att1": attrColumn="att2";attrColumnSelect="att1";break;
		case "att2": attrColumn="att1";attrColumnSelect="att2";break;
	}
	a=0;	
	var str="<ul class=attributeList_"+attrColumn+" attribute_"+attrColumn+"_"+this.productDetailInstance.configObjArea["objProductUniqueId"]+">";
	for (var eachAttrSet in this.productInstance.attributeValues) {
		if(this.productInstance.attributeValues[eachAttrSet].values[attrColumnSelect]==attrValue && (this.productInstance.attributeValues[eachAttrSet].data["atronhand"]>0)){
			this.existingAttributes[a] = this.productInstance.attributeValues[eachAttrSet].values[attrColumn]; 
			a++;
		}
	}
	this.updateListAttributes(attrColumn,attrColumnSelect);	
};

AttributeSwatchClass.prototype.checkAvailOneAttributes = function(attrColumn, attrName) {
	this.existingAttributes = new Array();
	this.availAttributes = new Array();
	a=0;	
	var str="<ul class=attributeList_"+attrColumn+" attribute_"+attrColumn+"_"+this.productDetailInstance.configObjArea["objProductUniqueId"]+">";
	for (var eachAttrSet in this.productInstance.attributeValues) {
		if(this.productInstance.attributeValues[eachAttrSet].data["atronhand"]>0){
			this.existingAttributes[a]=this.productInstance.attributeValues[eachAttrSet].values[attrColumn]; 
			a++;
		}
	}
	this.updateListAttributes(attrColumn);
};

AttributeSwatchClass.prototype.updateListAttributes = function(attrColumn,attrColumnSelect) {
	//compare existingAttributes with the full range
	for(i=0; i < this.ListAttributes[attrColumn].length; i++){
		// if there is no any existingAttributes (ie. all out of stock)
		if(this.existingAttributes.length==0){this.availAttributes[i] = false;}
		for(j=0; j < this.existingAttributes.length; j++){
			if(this.ListAttributes[attrColumn][i]==this.existingAttributes[j]){
				this.availAttributes[i] = this.existingAttributes[j];
				break;
			}else{
				this.availAttributes[i] = false;
			}
		}		
		if(this.availAttributes[i] != false){
			if(this.ListAttributes[attrColumn][i]==this.filters[attrColumn]){
				document.getElementById("swatch"+this.ListAttributes[attrColumn][i]+this.productDetailInstance.configObjArea["objProductUniqueId"]).className="selected";
			}else{
				document.getElementById("swatch"+this.ListAttributes[attrColumn][i]+this.productDetailInstance.configObjArea["objProductUniqueId"]).className="available";
			}
			/* case: has 1 value of attribute one or two - select this one */
			if(attrColumnSelect && this.ListAttributes[attrColumn].length==1){
				document.getElementById("swatch"+this.ListAttributes[attrColumn][0]+this.productDetailInstance.configObjArea["objProductUniqueId"]).className="selected";
				this.addFilter(attrColumn,this.ListAttributes[attrColumn][0]);
				this.config.formHTMLObject.elements[attrColumn].value = this.ListAttributes[attrColumn][0];
			}
		}else{
			document.getElementById("swatch"+this.ListAttributes[attrColumn][i]+this.productDetailInstance.configObjArea["objProductUniqueId"]).className="notavail";
			if(this.attrNum==1){
				// if has only one attr - unclickable out of stock attribute
				document.getElementById("swatch"+this.ListAttributes[attrColumn][i]+this.productDetailInstance.configObjArea["objProductUniqueId"]).attributes["onclick"].value="";
				document.getElementById("swatch"+this.ListAttributes[attrColumn][i]+this.productDetailInstance.configObjArea["objProductUniqueId"]).style.cursor="default";
			}
			if(this.ListAttributes[attrColumn][i]==this.filters[attrColumn]){
				// clear if no combination
				this.filters[attrColumn]="";
				this.addFilter(attrColumn,"");
				this.config.formHTMLObject.elements[attrColumn].value = "";
				if(attrColumnSelect){
					/*case: if attrColumn was reset - add available to another attribute and if it was selected also add class selected  */
					for(ii=0; ii < this.ListAttributes[attrColumnSelect].length; ii++){
						if(this.ListAttributes[attrColumnSelect][ii]==this.filters[attrColumnSelect]){
							document.getElementById("swatch"+this.ListAttributes[attrColumnSelect][ii]+this.productDetailInstance.configObjArea["objProductUniqueId"]).className="selected";
						}else{
							document.getElementById("swatch"+this.ListAttributes[attrColumnSelect][ii]+this.productDetailInstance.configObjArea["objProductUniqueId"]).className="available";
						}
					}
				}
			}
		}
	}
};

// Highlight selected option
AttributeSwatchClass.prototype.highlightSelection = function(attrColumn,id){
	for(i=0; i < this.ListAttributes[attrColumn].length; i++){
		if(this.ListAttributes[attrColumn][i] == id){
			var x = "swatch"+this.ListAttributes[attrColumn][i]+this.productDetailInstance.configObjArea["objProductUniqueId"];
			document.getElementById(x).className = "selected";

		}else{
			if(document.getElementById("swatch"+this.ListAttributes[attrColumn][i]+this.productDetailInstance.configObjArea["objProductUniqueId"]).className != "notavail"){
				document.getElementById("swatch"+this.ListAttributes[attrColumn][i]+this.productDetailInstance.configObjArea["objProductUniqueId"]).className = "available";
			}
		}
	}
};

AttributeSwatchClass.prototype.changePrice = function(id, wasid){
	var price = "";
	var wasprice = "";

	if (this.attrNum == 1) {
		for (var eachAttrSet in this.productInstance.attributeValues) {
			if(this.productInstance.attributeValues[eachAttrSet].values["att1"]==this.filters["att1"]){
				if (this.productInstance.attributeValues[eachAttrSet].data["atrsell"]!="" && this.productInstance.attributeValues[eachAttrSet].data["atrsell"]!=undefined) {
					price = this.productInstance.attributeValues[eachAttrSet].data["atrsell"].toFixed(2);
				}
				if (this.productInstance.attributeValues[eachAttrSet].data["atrwas"]!="" && this.productInstance.attributeValues[eachAttrSet].data["atrwas"]!=undefined){
					wasprice = this.productInstance.attributeValues[eachAttrSet].data["atrwas"].toFixed(2);
				}
			}
		}	
	} else if (this.attrNum == 2) {
		for (var eachAttrSet in this.productInstance.attributeValues) {
			if(this.productInstance.attributeValues[eachAttrSet].values["att1"]==this.filters["att1"] && this.productInstance.attributeValues[eachAttrSet].values["att2"]==this.filters["att2"]){
				if (this.productInstance.attributeValues[eachAttrSet].data["atrsell"]!="" && this.productInstance.attributeValues[eachAttrSet].data["atrsell"]!=undefined) {
					price = this.productInstance.attributeValues[eachAttrSet].data["atrsell"].toFixed(2);
				}
				if (this.productInstance.attributeValues[eachAttrSet].data["atrwas"]!="" && this.productInstance.attributeValues[eachAttrSet].data["atrwas"]!=undefined){
					wasprice = this.productInstance.attributeValues[eachAttrSet].data["atrwas"].toFixed(2);
				}
			}
		}		
	}
	
	if (price == "") { price = this.defaultprice;}
	if (wasprice == "") { wasprice = this.defaultwasprice; }
	if (price != "") {
		document.getElementById(id).innerHTML = this.productInstance.labels['currsym'] + price;
	}
	if (wasprice!="" && (parseFloat(wasprice)>parseFloat(price))) {
		//support case normal product type and product type Family with valid Size and Colour
		document.getElementById(wasid).innerHTML = this.waslabel + this.productInstance.labels['currsym'] + wasprice;	
	}else{
		if(wasprice==this.defaultwasprice && this.defaultwasprice>price && this.producttype=="family") {
			//support case product type Family with invalid Size and Colour
			document.getElementById(wasid).innerHTML = this.waslabel + this.productInstance.labels['currsym'] + wasprice;	
		} else {
			document.getElementById(wasid).innerHTML = "";
		}
	}
};

AttributeSwatchClass.prototype.actionSet = function(attrColumn,attrValue){
	this.config.formHTMLObject.elements[attrColumn].value = attrValue;
	this.addFilter(attrColumn,attrValue);
	this.highlightSelection(attrColumn,attrValue);
	// do checkAvailAttributes only if has more than one attributes
	if(this.attrNum>1){this.checkAvailAttributes(attrColumn,attrValue)}
	this.etaDate();
};

AttributeSwatchClass.prototype.mediapath="";
AttributeSwatchClass.prototype.addtobasketbt="bt_addtobasket.gif";
AttributeSwatchClass.prototype.backorderbt="bt_backorder.gif";
AttributeSwatchClass.prototype.today="";

AttributeSwatchClass.prototype.etaDate=function(){
	/* if not has add to basket button exit fn */
	if(jQuery("#addproduct").length<1) return ;
	/* set media path */
	jQuery(".link_btm p.eta").remove();
	if(this.mediapath==""){
		this.mediapath=jQuery("#addproduct"+this.productDetailInstance.configObjArea["objProductUniqueId"]).attr("src");
		this.mediapath=this.mediapath.substr(0,this.mediapath.lastIndexOf('/')+1);
		this.backorderbt=this.mediapath+this.backorderbt;
		this.addtobasketbt=this.mediapath+this.addtobasketbt;
		this.today=new Date(jQuery("#today"+this.productDetailInstance.configObjArea["objProductUniqueId"]).text());
	}
	if (this.attrNum == 1) {
		for (var eachAttrSet in this.productInstance.attributeValues) {
			if(this.productInstance.attributeValues[eachAttrSet].values["att1"]==this.filters["att1"]){
				if (this.productInstance.attributeValues[eachAttrSet].data["atretady"]!="" && this.productInstance.attributeValues[eachAttrSet].data["atretady"]!=undefined && 
					this.productInstance.attributeValues[eachAttrSet].data["atretamn"]!="" && this.productInstance.attributeValues[eachAttrSet].data["atretamn"]!=undefined &&
					this.productInstance.attributeValues[eachAttrSet].data["atretayr"]!="" && this.productInstance.attributeValues[eachAttrSet].data["atretayr"]!=undefined) {
					
					var etaday=new Date();
					etaday.setFullYear(this.productInstance.attributeValues[eachAttrSet].data["atretayr"],this.productInstance.attributeValues[eachAttrSet].data["atretamn"]-1,this.productInstance.attributeValues[eachAttrSet].data["atretady"]);
					if(this.today<etaday){
						ETA = this.productInstance.attributeValues[eachAttrSet].data["atretady"]+"/"+this.productInstance.attributeValues[eachAttrSet].data["atretamn"]+"/"+this.productInstance.attributeValues[eachAttrSet].data["atretayr"];
						jQuery("#addproduct"+this.productDetailInstance.configObjArea["objProductUniqueId"]).attr("src",this.backorderbt);
						jQuery(".link_btm").append('<p class="eta">'+this.availableText+ETA+'</p>');						
						return ;
					}
				}
			}
		}
	} else if (this.attrNum == 2) {
		for (var eachAttrSet in this.productInstance.attributeValues) {
			if(this.productInstance.attributeValues[eachAttrSet].values["att1"]==this.filters["att1"] && this.productInstance.attributeValues[eachAttrSet].values["att2"]==this.filters["att2"]){
				if (this.productInstance.attributeValues[eachAttrSet].data["atretady"]!="" && this.productInstance.attributeValues[eachAttrSet].data["atretady"]!=undefined && 
					this.productInstance.attributeValues[eachAttrSet].data["atretamn"]!="" && this.productInstance.attributeValues[eachAttrSet].data["atretamn"]!=undefined &&
					this.productInstance.attributeValues[eachAttrSet].data["atretayr"]!="" && this.productInstance.attributeValues[eachAttrSet].data["atretayr"]!=undefined) {
					var today=new Date();
					var etaday=new Date();
					etaday.setFullYear(this.productInstance.attributeValues[eachAttrSet].data["atretayr"],this.productInstance.attributeValues[eachAttrSet].data["atretamn"]-1,this.productInstance.attributeValues[eachAttrSet].data["atretady"]);
					if(this.today<etaday){
						ETA = this.productInstance.attributeValues[eachAttrSet].data["atretady"]+"/"+this.productInstance.attributeValues[eachAttrSet].data["atretamn"]+"/"+this.productInstance.attributeValues[eachAttrSet].data["atretayr"];
						jQuery("#addproduct"+this.productDetailInstance.configObjArea["objProductUniqueId"]).attr("src",this.backorderbt);
						jQuery(".link_btm").append('<p class="eta">'+this.availableText+ETA+'</p>');						
						return ;
					}
				}
			}
		}
	}
	jQuery("#addproduct"+this.productDetailInstance.configObjArea["objProductUniqueId"]).attr("src",this.addtobasketbt);
};

/* Show tooltip for unavailable options */
AttributeSwatchClass.prototype.showTooltipMessage = function (id){
	if(document.getElementById(id).className=="notavail"){
		document.getElementById(id).attributes["onclick"].value="";
		document.getElementById("swatchUnavailTooltip"+this.productDetailInstance.configObjArea["objProductUniqueId"]).className = "show swatchUnavailTooltip";
		var posLeft = document.getElementById(id).offsetLeft-(document.getElementById("swatchUnavailTooltip"+this.productDetailInstance.configObjArea["objProductUniqueId"]).offsetWidth/2)+(document.getElementById(id).offsetWidth/2);
		var posTop = document.getElementById(id).offsetTop-document.getElementById("swatchUnavailTooltip"+this.productDetailInstance.configObjArea["objProductUniqueId"]).offsetHeight-document.getElementById("swatchUnavailTooltipArrow"+this.productDetailInstance.configObjArea["objProductUniqueId"]).offsetHeight;
		document.getElementById("swatchUnavailTooltip"+this.productDetailInstance.configObjArea["objProductUniqueId"]).style.left = posLeft+"px";
		document.getElementById("swatchUnavailTooltip"+this.productDetailInstance.configObjArea["objProductUniqueId"]).style.top = posTop+"px";
	}
};

AttributeSwatchClass.prototype.hideTooltipMessage = function (){
	document.getElementById("swatchUnavailTooltip"+this.productDetailInstance.configObjArea["objProductUniqueId"]).className = "hide swatchUnavailTooltip";
};
