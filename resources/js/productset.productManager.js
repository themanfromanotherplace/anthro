
function MultiProductDetailManager(){
	

	
	this.productDetailObjects = [];
	
	this.getProductObjectByUniqueId = function( productId ){
		
		var productInstance = false;
		
		for(var i=0; i<this.productDetailObjects.length;i++){
			
			if( this.productDetailObjects[i].configObjArea["objProductUniqueId"] == productId ){
				
				productInstance = this.productDetailObjects[i];
				
			};
		};
		
		return productInstance;
		
	};
	
	this.addProductObject = function( productDetailObject ){
		
		//check if it exists:
		//if( !this.getProductObjectByUniqueId( productDetailObject.configObjArea["objProductUniqueId"] ) ){
			
			//return instance
			this.productDetailObjects.push( productDetailObject );
			
		//}else{
			
			//add to array of instances
		//	return this.getProductObjectByUniqueId( productDetailObject.configObjArea["objProductUniqueId"] );
		//}
		
	};

};