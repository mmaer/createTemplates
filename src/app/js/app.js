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

		if (typeof border !== 'object') {
			console.log("aa");

			CT.border = CT.canvas.add(new fabric.Rect({
				fill: 'rgba(0,255,0,0.0)',
				top: 1, 
				left: 1, 
				height: 100, 
				width: 100,
				stroke: 'red'
			}));
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
	},

	setCounter: function (startNumber) {

	},

	setHeightTemplate: function (heightTemplate) {
		//console.log(CT.canvas.item);
		//CT.border.height = parseInt(heightTemplate.value);
		CT.border.setHeight(parseInt(heightTemplate.value, 10)).setCoords();
		CT.canvas.renderAll.bind(CT.canvas)
	},

	setWidthTemplate: function (widthTemplate) {

	},

	setMarginTop: function (marginTop) {

	},

	setMarginLeft: function (marginLeft) {

	}

};

}(window, CT));