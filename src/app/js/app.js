var CT = CT || {};

(function (w, ct) {

CT = {

	canvas: new fabric.Canvas('createtemplate'),
	counterFlag: false,
	startNumber: 0,
	heightTemplate: 0,
	widthTemplate: 0,
	marginTop: 0,
	marginLeft: 0,
	border: null,

	init: function () {

		/*if (typeof border !== 'object') {
			console.log("aa");

			var border = new fabric.Rect({
				fill: 'rgba(0,255,0,0.0)',
				top: 1, 
				left: 1, 
				height: 100, 
				width: 100,
				stroke: 'red'
			});

			CT.canvas.add(border);

			CT.border = border;*/
		} 

	},

	addEventListener: function () {
	    

	},

	addFolderImages: function () {

	},

	addTemplateImage: function (e) {

		var reader = new FileReader();

		reader.onprogress = function (evt) {
            var percentComplete = (evt.loaded / evt.total) * 100;
            console.log(percentComplete);
        }

        reader.onload = function (event) {
            var imgObj = new Image();
            imgObj.src = event.target.result;
            imgObj.onload = function() {

                var image = new fabric.Image(imgObj);
                CT.canvas.setWidth(image.width);
    			CT.canvas.setHeight(image.height);
                CT.canvas.setOverlayImage(image, CT.canvas.renderAll.bind(CT.canvas));
            }
        }
        reader.readAsDataURL(e.target.files[0]);
        CT.border.bringToFront();
	},

	setCounter: function (startNumber) {

	},

	setHeightTemplate: function (heightTemplate) {

		var height = parseInt(heightTemplate.value, 10);
		this.heightTemplate = height;

		CT.border.setHeight(height).setCoords();
		CT.canvas.renderAll()
	},

	setWidthTemplate: function (widthTemplate) {

		var width = parseInt(widthTemplate.value, 10);
		this.widthTemplate = width;
		
		CT.border.setWidth(width).setCoords();
		CT.canvas.renderAll()
	},

	setMarginTop: function (marginTop) {

		var top = parseInt(marginTop.value, 10);
		this.marginTop = top;
		
		CT.border.setTop(top).setCoords();
		CT.canvas.renderAll()
	},

	setMarginLeft: function (marginLeft) {

		var left = parseInt(marginLeft.value, 10);
		this.marginLeft = left;
		
		CT.border.setLeft(left).setCoords();
		CT.canvas.renderAll()
	}

};

}(window, CT));