(function(){
	
	SlidersHandler = (function(){
		
		var constructor = function(inputsColl){
			
			var self = this;
			var inputsColl = inputsColl;
			var stack = {};
			
			smp.events.extend(this);
			
			smp.each(inputsColl, function(ind,input){
				//input.addEventListener("change", onInputChange);
				input.addEventListener("mouseup", onInputChange);
			});
			
			function onInputChange(evt){
				var input = evt.currentTarget;
				handleSliders(input.getAttribute("name"), input.value);
				updateLabel(input);
			}
			
			function handleSliders(name,value){
				
				stack[name] = value;
				self.dispatchEvent("CHANGE", {stack:stack});
			}
			
			function updateLabel(input){
				var label = input.parentNode.getElementsByTagName("label")[0];
				label.getElementsByTagName("span")[0].innerHTML = (Math.round(input.value*10)/10).toString();
			}
			
			
			this.reset = function(){
				smp.each(inputsColl, function(ind,input){
					var name = input.getAttribute("name");
					if(name == "posterization"){
						input.value = 256;
					}else{
						input.value = 1;
					}
					stack = {};
					updateLabel(input);
				});
				
				//self.dispatchEvent("CHANGE", {stack:stack});
				
			}

		}
		
		return constructor;
		
	}());
}());