(function(){
	
	SelectionLayer = (function(){
		
		var d = document;
		
		var constructor = function(imgel, ratio){
			
			
			var self = this,
				initMousePos,
				initLayerPos,
				initRotatePos,
				mousedownlayer = false,
				mousedownRotate = false,
				layer, rotateIcon,
				container = imgel.parentNode,
				imgOffset = {left:imgel.offsetLeft, top:imgel.offsetTop},
				imgsize = {width:imgel.width, height:imgel.height},
				rect = {x:0,y:0,width:0,height:0,angle:0},
				angleInc = Math.PI*2/360;

			smp.events.extend(this);
			
			//public
			function addLayer(x,y){
				if(!layer) {
					initializeLayer();
				}
				container.insertBefore(layer, imgel);
				initLayerPos = {x:x, y:y};
				
				layer.style.left = x+"px";
				layer.style.top = y+"px";
				layer.style["-webkit-transform"] = "rotate(0deg)";
				
				rect.angle = 0;
				rect.x = x;
				rect.y = y;
				resizeLayer(1,1);
				
				layer.addEventListener("mousedown", onLayerDown);
				
			}
			function resizeLayer(w,h){
				if(w<0 && h<0){
					w=-w; h=-h;
					moveLayer(-w,-h);
				}else if(h<0){
					h=-h;
					moveLayer(0,-h);
				}else if(w<0){
					w=-w; 
					moveLayer(-w,0);
				}

				//constrain
				if(w/h>ratio){
					if(rect.x + w > imgsize.width) w = imgsize.width-rect.x;
					h=w*1/ratio;
					if(rect.y + h > imgsize.height){
						h = imgsize.height-rect.y;
						w=h*ratio;
					}
				}else{
					if(rect.y + h > imgsize.height) h = imgsize.height-rect.y;
					w=h*ratio;
					if(rect.x + w > imgsize.width){
						w = imgsize.width-rect.x;
						h=w*1/ratio;
					}
				}
				
				layer.style.width = w+"px";
				layer.style.height = h+"px";
				rect.width = w;
				rect.height = h;
				self.dispatchEvent("CHANGE", rect);
			}
			function moveLayer(x,y){
				
				if(initLayerPos.x+x + rect.width > imgsize.width){ x = imgsize.width - initLayerPos.x - rect.width;}else if(initLayerPos.x+x < 0){ x = - initLayerPos.x;}
				if(initLayerPos.y+y + rect.height > imgsize.height){ y = imgsize.height - initLayerPos.y - rect.height;}else if(initLayerPos.y+y < 0){ y = - initLayerPos.y;}
				
				rect.x = initLayerPos.x+x;
				rect.y = initLayerPos.y+y;
				layer.style.left = (initLayerPos.x+x).toString()+"px";
				layer.style.top = (initLayerPos.y+y).toString()+"px";
				self.dispatchEvent("CHANGE", rect);
			}
			function removeLayer(){
				container.removeChild(layer);
				rect.angle = 0;
				layer.style["-webkit-transform"] = "rotate(0deg)";
			}
			

			//private
			function initializeLayer(){
				layer = d.createElement("div");
				layer.setAttribute("class","layer");
				rotateIcon =  d.createElement("div");
				rotateIcon.setAttribute("class","rotate-icon");
				layer.appendChild(rotateIcon);
				
				rotateIcon.addEventListener("mousedown", onRotateDown);
				
			}
			
			//event handlers
			
			function onDocUp(evt){
				mousedownlayer = false;
			}
			
			function onLayerDown(evt){
				mousedownlayer = true;
				initMousePos = getMousePos(evt);
				var left = layer.style.left;
				var top = layer.style.top;
				initLayerPos = {
						x: Number(left.substr(0, left.length-2)),
						y: Number(top.substr(0, top.length-2))
				}
				layer.addEventListener("mousemove", onLayerMove);
				layer.addEventListener("mouseup", onLayerUp);
				d.addEventListener("mouseup", onDocUp);
			}
			function onLayerMove(evt){
				if(mousedownlayer){
					var pos = getMousePos(evt);
					moveLayer(pos.x-initMousePos.x, pos.y-initMousePos.y);
				}
			}
			function onLayerUp(evt){
				mousedownlayer = false;
				removeEvents();
			}
			
			function removeEvents(){
				layer.removeEventListener("mousemove", onLayerMove);
				layer.removeEventListener("mouseup", onLayerUp);
				d.removeEventListener("mouseup", onDocUp);
				
				rotateIcon.removeEventListener("mousemove", onRotateMove);
				rotateIcon.removeEventListener("mouseup", onRotateUp);
				layer.removeEventListener("mousemove", onRotateMove);
				layer.removeEventListener("mouseup", onRotateUp);
				
			}
			
			function onRotateDown(evt){
				mousedownlayer = false;
				removeEvents();
				mousedownRotate = true;
				initRotatePos = getMousePos(evt);
				
				rotateIcon.addEventListener("mousemove", onRotateMove);
				rotateIcon.addEventListener("mouseup", onRotateUp);
				layer.addEventListener("mousemove", onRotateMove);
				layer.addEventListener("mouseup", onRotateUp);
				
				evt.stopPropagation();
			}
			function onRotateMove(evt){
				if(mousedownRotate){
					var pos = getMousePos(evt);
					rect.angle = normalize((pos.y - initRotatePos.y),-rect.height/2,rect.height/2,-Math.PI,Math.PI);
					layer.style["-webkit-transform"] = "rotate("+Number(rect.angle  * (180/Math.PI) % 360).toString()+"deg)";
					self.dispatchEvent("CHANGE", rect);
				}
			}
			function onRotateUp(evt){
				mousedownRotate = false;
				removeEvents();
			}
			
			//utils
			function getMousePos(evt){
				return {
					x:Math.floor(evt.pageX-imgOffset.left),
					y:Math.floor(evt.pageY-imgOffset.top)
				}
			}

			function normalize(value,inmin,inmax,outmin,outmax){
				return (value - inmin) / (inmax - inmin) * (outmax - outmin) + outmin;
			}
			
			this.addLayer = addLayer;
			this.moveLayer = moveLayer;
			this.resizeLayer = resizeLayer;
			this.removeLayer = removeLayer;
			this.rect = function(){
				return rect;
			}
			
			
		}
		
		
		return constructor;
		
		
		
	}());
	
}());

