
//helper class
function showMainImage(productInstance){
	
	this.productInstance = productInstance;
};

showMainImage.prototype.imgObj = null;

showMainImage.prototype.doIt = function(instanceObject) {
	    
	   //var instance = instanceObject;
	    //var self = this;
	    
		setTimeout(function(){
			
			 	instanceObject.hideLoading()
			 
			 }, 700);
	};

showMainImage.prototype.hideLoading = function() {

		if (document.getElementById("loadingMain" + this.productInstance.configObjArea["objProductUniqueId"])) {
			document.getElementById("loadingMain" + this.productInstance.configObjArea["objProductUniqueId"]).style.display = "none";
		}	
		
		this.imgObj.style.display = "block";
		
		this.productInstance.activejQzoom();
		
		};
		
showMainImage.prototype.setImg = function(imgObj) {
		this.imgObj = imgObj;
};