(function(){
	
	var d = document,
		main = d.getElementById("main"),
		container = d.getElementById("image-container"),
		selw = 300,selh=200,
		img, canvas, context, auxcanvas, auxcontext;

	
	var dropArea = new DropArea(container);
	dropArea.addEventListener("ADDED", onImageAdded);
	
	function onImageAdded(evt){
		img = evt.data.image;
		if(!img.width){
			img.addEventListener("load", onImgLoaded);
		}else{
			onImgLoaded();
		}
	}
	
	function onImgLoaded(evt){
		var ratio = selw/selh;
		
		container.style.width = img.width+"px";
		container.style.height = img.height+"px";
		
		if(!canvas){
			var imgCtl = new ImageController(img, ratio);
			
			canvas = d.createElement("canvas");
			context = canvas.getContext("2d");
			auxcanvas = d.createElement("canvas");
			auxcontext = auxcanvas.getContext("2d");
		
			canvas.width = selw;
			canvas.height = selh;
			
			main.appendChild(canvas);
			auxcanvas.style.opacity = "0.4";
			//main.appendChild(auxcanvas);
			
			imgCtl.selection().addEventListener("CHANGE",onSelectionChanged);
			canvas.addEventListener("click", onPreviewClicked);
			
		}
		
		auxcanvas.width = img.width;
		auxcanvas.height = img.height;
		
		auxcontext.drawImage(img,0,0);
		if(img.height*ratio < img.width){
			context.drawImage(img,0,0,img.height*ratio,img.height,0,0,selw,selh);
		}else {
			context.drawImage(img,0,0,img.width,img.width*1/ratio,0,0,selw,selh);
		}
		
		
	}
	
	function onSelectionChanged(evt){
		
		var rect = evt.data;
		var angle = rect.angle;
		
		auxcontext.clearRect(0,0,auxcanvas.width,auxcanvas.height);
		
		/*
		 * Because we cannot rotate the source rectangle,
		 * nor the image element itself,
		 * we will rotate an auxiliar canvas and draw the image on it.
		 * We will then read from that auxiliar canvas using our source rectangle
		 */
		
		var cos = Math.cos(angle);
		var sin = Math.sin(angle);
		var x = rect.x + rect.width/2;
		var y = rect.y + rect.height/2;
		/*
		Rotate the auxiliar context around the selection center (x,y)
		[a, c, x-a*x-c*x  [cos,  sin, x - cos*x - sin*y]
		 b, d, y+c*x-d*y]  -sin, cos, y + sin*x - cos*y]
		*/
		auxcontext.setTransform(cos,-sin,sin,cos, x - cos*x - sin*y, y +sin*x - cos*y);
		
		//Apply the image over the previously rotated context, the image will be rotated around the selection center
		auxcontext.drawImage(img,0,0);
		
		context.clearRect(0,0,canvas.width,canvas.height);
		//Read from the auxiliar canvas using the selection (without rotation) as the origin rectangle
		context.drawImage(auxcanvas,rect.x,rect.y,rect.width,rect.height,0,0,canvas.width,canvas.height);
	}
	
	function onPreviewClicked(evt){
		var imageData = canvas.toDataURL("image/png");
		//var imageUrl = imageData.replace("image/png", "image/octet-stream");
		window.open(imageData,'userimage','width='+canvas.width+',height='+canvas.height+',left=100,top=100,resizable=No');

	}
	
	
}());




