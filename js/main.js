(function()
{

	var data = {
		'canvas_width': 690,
    	'canvas_height': 540,
    	'template_height': 100,
    	'template_width': 100,
    	'template_top': 0,
    	'template_left': 0
    	'params': {
    		
    	}
	};

	function Canvas()
	{
		this.data = data;
		this.canvas = window._canvas = new fabric.Canvas('canvas');
      	this.params = {};
	}

	var Canvas = new Canvas(data);

})()