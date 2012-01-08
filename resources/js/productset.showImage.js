
//helper class
function showMainImage(){
	
	this.productInstance = false;
	
	this.imgObj = null;
	
	this.doIt = function(instanceObject) {
		    
		   //var instance = instanceObject;
		    //var self = this;
		    
			setTimeout(function(){
				
				 	instanceObject.hideLoading()
				 
				 }, 700);
		};
	
	this.hideLoading = function() {
	
			if (document.getElementById("loadingMain" + this.productInstance.configObjArea["objProductUniqueId"])) {
				document.getElementById("loadingMain" + this.productInstance.configObjArea["objProductUniqueId"]).style.display = "none";
			}	
			
			this.imgObj.style.display = "block";
			
			this.productInstance.activejQzoom();
			
			};
			
	this.setImg = function(imgObj) {
			this.imgObj = imgObj;
	};

};