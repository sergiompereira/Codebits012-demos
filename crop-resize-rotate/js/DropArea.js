(function(){
	
	DropArea = (function(){
		
		var d = document;
		
		var constructor = function(el){
			var self = this;
			var img;
			
			el.addEventListener("dragenter", onDragEnter);
			el.addEventListener("dragenter", onDragOver);
			el.addEventListener("drop", onDrop);
			
			smp.events.extend(this);
			
			//event handlers
			function onDragEnter(evt){
				evt.preventDefault();
				evt.stopPropagation();
			}
			
			function onDragOver(evt){
				evt.preventDefault();
				evt.stopPropagation();
			}
			
			function onDrop(evt){
				//needed to avoid the browser replacing the html with the picture in the url address.
				evt.preventDefault();
				evt.stopPropagation();
				
				var files = evt.dataTransfer.files,
					file,i,len = files.length, imgfiles = [];

				//the user might have dragged more than one file at once.
				for(i=0; i<len; i++){
					file = files[i];
					
					if(file.type == "image/jpeg" || file.type == "image/png" || file.type == "image/gif"){
						imgfiles.push(file);
					}
				}
				//self.dispatchEvent("ADDED", {files:imgfiles});
				onFilesAdded(imgfiles);
			}
			
			
			function onFilesAdded(files){
				var i, 
					len = files.length;
				
				/*for(i=0; i<len; i++){
					img = d.createElement("img");
					setSrcFromFile(files[i], img);
					img.setAttribute("draggable", "false");
					container.appendChild(img);
				}*/
				
				//select just the first file
				file = files[0];
				if(!img) {
					img = d.createElement("img");
                    el.innerHTML = "";
					el.appendChild(img);
				}
				setSrcFromFile(file, img);
				img.setAttribute("draggable", "false");
				
				self.dispatchEvent("ADDED", {image:img});
			}
			
			//utils
			function setSrcFromFile(file,imgel){
				var URL = window.URL || window.webkitURL;
				if(URL && URL.createObjectURL){
					var imgURL = URL.createObjectURL(file);
					imgel.src = imgURL;
					URL.revokeObjectURL(imgel);
				}else if(typeof FileReader !== "undefined" && (/image/i).test(file.type)){
					var reader = new FileReader();
					reader.onload = function(){
						imgel.src = evt.target.result;
					}
					reader.readAsDataURL(file);
				}
			}
			
		}
		return constructor;
	}());
}());