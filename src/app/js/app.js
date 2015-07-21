var CT = CT || {};

(function (w, ct) {

CT = {

	canvas: new fabric.Canvas('createtemplate'),
	counterFlag: false,
	startNumber: 0,
	heightCanvas: 0,
	widthCanvas: 0,
	heightTemplate: 0,
	widthTemplate: 0,
	marginTop: 0,
	marginLeft: 0,

	folderImages: null,

	overcanvas: document.getElementById('overcanvas'),

	init: function () {
		this.heightCanvas = this.canvas.height;
		this.widthCanvas = this.canvas.width;
		this.overcanvas.style.top = -this.heightCanvas + "px";
	},

	addEventListener: function () {
	    

	},

	addFolderImages: function (e) {
		console.log(e.target.files);
		this.folderImages = e;
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
                CT.init();
            }
        }

        reader.readAsDataURL(e.target.files[0]);        
	},

	setCounter: function (startNumber) {

	},

	setHeightTemplate: function (heightTemplate) {

		var height = parseInt(heightTemplate.value, 10);

		this.heightTemplate = height;

		this.overcanvas.style.height = height + "px";
		this.overcanvas.style.top += height + "px";
	},

	setWidthTemplate: function (widthTemplate) {

		var width = parseInt(widthTemplate.value, 10);
		this.widthTemplate = width;
		
		this.overcanvas.style.width = width + "px";
	},

	setMarginTop: function (marginTop) {

		var top = parseInt(marginTop.value, 10),
			margin = -this.heightCanvas + top;

		this.marginTop = top;

		this.overcanvas.style.top = margin + "px";
	},

	setMarginLeft: function (marginLeft) {

		var left = parseInt(marginLeft.value, 10);

		this.marginLeft = left;
	
		this.overcanvas.style.left = left + "px";
	}

};

}(window, CT));