importScripts("Filter.js");

(function(){
	var console = {};
	console.log = function(msg){
		postMessage({"action":"log", "msg":msg});
	};
	this.addEventListener('message', function(evt) {
		var data = evt.data;
	
		if(data.action == "process"){
			var imgdata = data.imgdata,
				buffer = data.buffer,
				stack = data.stack,
				width = imgdata.width,
				height = imgdata.height,
				x,y,color,key;
			
			for(y = 0; y < height; y++){
				for(x = 0; x < width; x++){
					color = getColor(imgdata,x,y);
					for(key in stack){
						if(Filter[key]){
							color = Filter[key](color, stack[key]);
						}
					}
					setColor(buffer, x,y,color);
				}
			}
			
			postMessage({"buffer":buffer});
		}
		
		
	}, false);

	
	//utils
	function getColor(imgdata, x,y){
		var i = y*imgdata.width*4 + x*4;
		var data = imgdata.data;

		var color = {r:0,g:0,b:0,a:0};
		color.r = data[i];
		color.g = data[i+1];
		color.b = data[i+2];
		color.a = data[i+3];

		return color;
	}
	function setColor(imgdata, x,y, color){
		var i = y*imgdata.width*4 + x*4;

		imgdata.data[i] = color.r;
		imgdata.data[i+1] = color.g;
		imgdata.data[i+2] = color.b;
		imgdata.data[i+3] = color.a;
	}
	
	
}());