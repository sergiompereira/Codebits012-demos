(function(){
	
	Filter = {};
	
	//REC 709
	// 0.2126*r + 0.7152*g + 0.0722*b;
	//REC 601
	// 0.3*r + 0.59*g + 0.11*b;
	//in any case, the coefficients sum to 1.
	var rlum = 0.2126;
	var glum = 0.7152;
	var blum = 0.0722;
	
	Filter.contrast = function(color, value)
	{		
		var dest = {};
		dest.r = contrastColor(color.r);
		dest.g = contrastColor(color.g);
		dest.b = contrastColor(color.b);
		
		function contrastColor(color){
			//formula : diferença de luminância / luminância média
			//ou seja, o desvio da média a dividir pela média.
			//http://en.wikipedia.org/wiki/Contrast_(formula)#Formula
			return ((color - 127)*value)+ 127;
		}
		
		dest.a = color.a;
		
		dest = range(dest);
		
		return dest;
	}
	Filter.brightness = function(color, value)
	{
		
		var dest = {};
		
		dest.r = changeColor(color.r);
		dest.g = changeColor(color.g);
		dest.b = changeColor(color.b);
		dest.a = color.a;
		
		function changeColor(color){
			return color + gaussian(color,125,100)* (value-1);
		}
		
		function gaussian(value, center, amplitude){
			var a = value, b = center, c = amplitude;
			//gaussian curve, so that black and white areas are less affected.
			return a*Math.pow(Math.E, -(Math.pow(value-b,2)/(2*Math.pow(c,2))));
		}
		
		dest = range(dest);
		
		return dest;
	}
	
	Filter.saturation = function(color, value)
	{
		var dest = {};
		
		dest.r = ((rlum + (1.0 - rlum) * value) * color.r) + ((glum + -glum * value) * color.g) + ((blum + -blum * value) * color.b);
		dest.g = ((rlum + -rlum * value) * color.r) + ((glum + (1.0 - glum) * value) * color.g) + ((blum + -blum * value) * color.b);
		dest.b = ((rlum + -rlum * value) * color.r) + ((glum + -glum * value) * color.g) + ((blum + (1.0 - blum) * value) * color.b);
		dest.a = color.a;
		
		dest = range(dest);
		
		return dest;
	}
	
	Filter.colorTemperature = function(color, value){		
	
		var dest = {};
		var inc = (value - 1)/2;
		var hinc = inc/2;
		if(value>1){
			dest.r = color.r*(1+hinc*(1-rlum));
			dest.g = color.g*(1+hinc*(1-glum));
			dest.b = color.b*(1-inc*(1-blum));
		}else if(value<1){
			dest.r = color.r*(1+inc*(1-rlum));
			dest.g = color.g*(1-hinc*(1-glum));
			dest.b = color.b*(1-hinc*(1-blum));
		}else{
			return color;
		}
	
		dest.a = color.a;
		
		dest = range(dest);
		
		return dest;
	}
	Filter.posterization = function(color, value)
	{
			var value = 255/value;
			var dest = {};
			dest.r = Math.round(color.r/value)*value;
			dest.g = Math.round(color.g/value)*value;
			dest.b = Math.round(color.b/value)*value;
			dest.a = color.a;
			
			return dest;
		};
	
	//utils
	function range(color){
		if(color.r>255)color.r = 255; else if(color.r<0)color.r = 0;
		if(color.g>255)color.g = 255; else if(color.g<0)color.g = 0;
		if(color.b>255)color.b = 255; else if(color.b<0)color.b = 0;
		if(color.a>255)color.a = 255; else if(color.a<0)color.a = 0;
		
		return color;
	}
}())