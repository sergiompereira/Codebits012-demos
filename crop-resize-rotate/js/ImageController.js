(function(){
	
	ImageController = (function(){
		
		var d = document;
		
		var constructor = function(imgel,ratio){
			
			var self = this,
				initPos,
				mousedownimage = false,
				imgOffset = {left:imgel.offsetLeft, top:imgel.offsetTop},
				layer = new SelectionLayer(imgel,ratio);
				
			//smp.events.extend(this);
			
			
			imgel.addEventListener("dragstart", function() { return false; });
			imgel.addEventListener("mousedown", onImgDown);
			imgel.addEventListener("mousemove", onImgMove);
			d.addEventListener("mouseup", onDocUp);	
		
			
			function onImgDown(evt){
				mousedownimage = true;
				//gets the mouse position relative the the img
				initPos = getMousePos(evt);
				layer.addLayer(initPos.x,initPos.y);
				return false;
			}
			function onImgMove(evt){
				if(mousedownimage) {
					var pos = getMousePos(evt);
					layer.resizeLayer(pos.x-initPos.x+imgOffset.left, pos.y -initPos.y +imgOffset.top);
				}
			}
			function onDocUp(evt){
				mousedownimage = false;
			}
			
			function getMousePos(evt){
				return {
					x:Math.floor(evt.pageX-imgOffset.left),
					y:Math.floor(evt.pageY-imgOffset.top)
				}
			}
			
			this.selection = function(){
				return layer;
			}
			this.selectionRect = function(){
				return layer.rect();
			}
		}
		
		return constructor;
		
	}());
}());
