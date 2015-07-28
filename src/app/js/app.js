var CT = CT || {};

(function (w, ct) {

CT = {

	/*** CANVAS ***/
	canvas: new fabric.Canvas('createtemplate'),
	startNumber: 0,
	heightCanvas: 0,
	widthCanvas: 0,
	heightTemplate: 0,
	widthTemplate: 0,
	marginTop: 0,
	marginLeft: 0,
	
	/*** FILE & FOLDER ***/
	folderImages: {},
	image: null,
	typeImage: 'jpeg',
	nameFolder: null,
	numberImage: 0, 

	status: document.querySelector("#status"),
	counterFlag: false,
	overcanvas: document.getElementById('overcanvas'),

	setStatus: function (isError, message) {

		this.status.style.display = "block";
        this.status.innerHTML = message;

        if (isError) {
            this.status.classList.add("alert-danger");
        } else {
            this.status.classList.add("alert-success");
        }
	},

	/*setCounter: function (startNumber) {

	},*/

	/***** SET WIDTH, HEIGHT, TOP AND LEFT *****/

	setHeightTemplate: function (heightTemplate) {

		var height = parseInt(heightTemplate.value, 10);

		this.heightTemplate = height;

		if (!this.checkSizeTemplate()) {
			return this.setStatus(true, "Wysokość szablonu jest za wysoka");
		} else {
			this.status.style.display = "none";
		}

		this.overcanvas.style.height = height + "px";
		this.overcanvas.style.top += height + "px";
	},

	setWidthTemplate: function (widthTemplate) {

		var width = parseInt(widthTemplate.value, 10);
		
		this.widthTemplate = width;

		if (!this.checkSizeTemplate()) {
			return this.setStatus(true, "Szerokość szablonu jest za wysoka");
		} else {
			this.status.style.display = "none";
		}

		this.overcanvas.style.width = width + "px";
	},

	setMarginTop: function (marginTop) {

		var top = parseInt(marginTop.value, 10),
			margin = -this.heightCanvas + top;

		this.marginTop = top;

		if (!this.checkSizeTemplate()) {
			return this.setStatus(true, "Górny marginesu jest za duży");
		} else {
			this.status.style.display = "none";
		}

		this.overcanvas.style.top = margin + "px";
	},

	setMarginLeft: function (marginLeft) {

		var left = parseInt(marginLeft.value, 10);

		this.marginLeft = left; 

		if (!this.checkSizeTemplate()) {
			return this.setStatus(true, "Lewy margines jest za duży");
		} else {
			this.status.style.display = "none";
		}

		this.overcanvas.style.left = left + "px";
	},

	updateProgressStatus: function(total, loaded) {

        var percentLoaded = (loaded / total) * 100;

        this.progressStatus.style.width = percentLoaded.toFixed(0) + "%";
        this.progressStatus.innerHTML = percentLoaded.toFixed(0) + "%";
	},

	checkSizeTemplate: function() {

		var hTemplateMarginTop = this.heightTemplate + this.marginTop,
			wTemplateMarginLeft = this.widthTemplate + this.marginLeft;

		if (hTemplateMarginTop > this.heightCanvas) {
			this.generateTemplateButton.onclick = null;
        	this.generateTemplateButton.setAttribute("disabled", "disabled");
			return false;
		}

		if (wTemplateMarginLeft > this.widthCanvas) {
			this.generateTemplateButton.onclick = null;
        	this.generateTemplateButton.setAttribute("disabled", "disabled");
			return false;
		}

		this.generateTemplateButton.onclick = true;
        this.generateTemplateButton.removeAttribute("disabled");
		return true;
 
	},

	addFolderImages: function (e) {
 
		var folder;

		this.folderImages = e.target.files;
		folder = this.folderImages[0].webkitRelativePath.split("/");
		this.nameFolder = folder[0];
	},

	addTemplateImage: function (e) {

		var reader = new FileReader(),
			percentComplete,
			imgObj,
			image;

		reader.onprogress = function (evt) {
            percentComplete = (evt.loaded / evt.total) * 100;
        };

        reader.onload = function (event) {
            imgObj = new Image();
            imgObj.src = event.target.result;
            imgObj.onload = function () {

                image = new fabric.Image(imgObj);
                CT.canvas.setWidth(image.width);
    			CT.canvas.setHeight(image.height);
                CT.canvas.setOverlayImage(image, CT.canvas.renderAll.bind(CT.canvas));
                CT.init();
            };
        };

        reader.readAsDataURL(e.target.files[0]);        
	},

	addImageToCanvas: function (callback, obj) {

		var reader = new FileReader();

		reader.onload = function () {
			var imgObj = new Image();
			imgObj.src = reader.result;

			imgObj.onload = function () {

				var image = new fabric.Image(imgObj);
				image.set({
					left: this.marginLeft,
					top: this.marginTop,
					height: this.heightTemplate,
					width: this.widthTemplate
				});

				if (this.canvas.add(image)) {
					callback.call(obj, null);
				}

			}.bind(this);

		}.bind(this);

		reader.readAsDataURL(this.image);
	},

	saveTemplate: function () {

		var image = new FormData(),
			template,
			xhr;

		this.canvas.deactivateAll().renderAll();

		template = this.canvas.toDataURL ({
			multiplier: 1,
			quality: 1,
			format: this.typeImage,
			left: this.marginLeft,
			top: this.marginTop,
			height: this.heightTemplate,
			width: this.widthTemplate
		});

		image.append("image", template);
		image.append("nameImage", this.image.name);
		image.append("nameFolder", this.nameFolder);

		xhr = new XMLHttpRequest();

        xhr.open("POST", "app/saveimage.php", true);

        xhr.onload = function (e) {

            if (e.target.status != 200) {
                this.setStatus(true, "Wystąpił błąd!");
            }
        };

        xhr.send(image);

        xhr.onreadystatechange = function () {
		    if (xhr.readyState == 4 && xhr.status == 200) {
		        if (this.folderImages.length >= this.numberImage) {
		        	
		        	this.numberImage++;
		        	this.updateProgressStatus(this.folderImages.length, this.numberImage);
		        	this.generateTemplate();
		        } 
		    }
		}.bind(this);
	},

	generateTemplate: function () {	

		if (!this.checkSizeTemplate()) {
			return false;
		}

		this.progressStatus.style.display = "block";

		if (typeof CT.folderImages[this.numberImage] != "undefined") {
			this.image = CT.folderImages[this.numberImage];
		} else {
			this.setStatus(false, "Generowanie templejtów zostało zakończone.")
		}
		
		this.addImageToCanvas(CT.saveTemplate, CT);
	},

	init: function () {

		var counterNumber = document.querySelector("#counternumber");
		var fileTemplate = document.querySelector("#filetemplate");
		var folderUpload = document.querySelector("#folderupload");
		var heightTemplate = document.querySelector("#heighttemplate");
		var widthTemplate = document.querySelector("#widthtemplate");

		var marginTop = document.querySelector("#margintop");
		var marginLeft = document.querySelector("#marginleft");

		this.generateTemplateButton = document.querySelector("#generatetemplate");

		counterNumber.addEventListener("change", CT.setCounter, 'false');
		fileTemplate.addEventListener("change", CT.addTemplateImage, 'false');
		folderUpload.addEventListener("change", function () { CT.addFolderImages(event);}, 'false');

		heightTemplate.addEventListener("change", function () { CT.setHeightTemplate(heightTemplate);}, 'false');
		widthTemplate.addEventListener("change", function () { CT.setWidthTemplate(widthTemplate);}, 'false');

		marginTop.addEventListener("change", function () { CT.setMarginTop(marginTop);}, 'false');
		marginLeft.addEventListener("change", function () { CT.setMarginLeft(marginLeft);}, 'false');

		this.generateTemplateButton.addEventListener("click", this.generateTemplate.bind(this), 'false');

		this.heightCanvas = this.canvas.height;
		this.widthCanvas = this.canvas.width;
		this.overcanvas.style.top = -this.heightCanvas + "px";

		this.progressStatus = document.querySelector('#progress-status');
	}
};

CT.init();

}(window, CT));