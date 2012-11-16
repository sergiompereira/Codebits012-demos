(function(){
	
	var d = document,
		main = d.getElementById("main"),
		container = d.getElementById("image-container"),
		img, canvas, context,
		originalImageData, width, height,
		inputs = d.getElementsByTagName("input"),
		slidersHandler,filtersWorker;

	
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
		
		container.style.width = img.width+"px";
		container.style.height = img.height+"px";
		
		if(!canvas){
			
			canvas = d.createElement("canvas");
			context = canvas.getContext("2d");
		
			container.style.border = "none";
            container.innerHTML = "";
			container.appendChild(canvas);
			
			filtersWorker = new Worker('js/filtersWorker.js');
			filtersWorker.onmessage = onWorkerResponse;
			
			slidersHandler = new SlidersHandler(inputs);
			slidersHandler.addEventListener("CHANGE", onSliderChanged);
			
			canvas.addEventListener("click", onPreviewClicked);
		}
		
		width = canvas.width = img.width;
		height = canvas.height = img.height;
		context.drawImage(img,0,0);
		originalImageData = context.getImageData(0,0,width, height);
		
		slidersHandler.reset();
	}
	
	
	function onSliderChanged(evt){
		//context.putImageData(process(originalImageData, context.createImageData(width,height), evt.data.stack),0,0)
		filtersWorker.postMessage({'action':'process', 
									'imgdata':originalImageData , 
									'buffer':context.createImageData(width,height) , 
									'stack':evt.data.stack});
	}
	
	function onWorkerResponse(evt){
		if(evt.data.action == "log"){
			console.log(evt.data.msg);
		}else{
			context.putImageData(evt.data.buffer,0,0);
		}
		
		
	}

	
	function onPreviewClicked(evt){
		var imageData = canvas.toDataURL("image/png");
		//var imageUrl = imageData.replace("image/png", "image/octet-stream");
		window.open(imageData,'userimage','width='+canvas.width+',height='+canvas.height+',left=100,top=100,resizable=No');

	}
	
	
	
}());




