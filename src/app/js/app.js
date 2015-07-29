var CT = CT || {};

(function (w, ct) {

CT = {

	/*** CANVAS ***/
	canvas: new fabric.Canvas('createtemplate'),
	startNumber: 0,
	canvasHeight: 0,
	canvasWidth: 0,
	templateHeight: 0,
	templateWidth: 0,
	templateMarginTop: 0,
	templateMarginLeft: 0,

	/*** CIRCLE ***/
	circleRadius: 50,
	circleFill: 'rgba(0, 0, 0, 1)',
	circleMarginTop: 0,
	circleMarginLeft: 0,
	
	/*** FILE & FOLDER ***/
	imagesFolder: {},
	image: null,
	imageType: 'jpeg',
	imageNumber: 0, 
	folderName: null,
	

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

	setTemplateHeight: function (heightTemplate) {

		var height = parseInt(heightTemplate.value, 10);

		this.templateHeight = height;

		if (!this.checkSizeTemplate()) {
			return this.setStatus(true, "Wysokość szablonu jest za wysoka");
		} else {
			this.status.style.display = "none";
		}

		this.overcanvas.style.height = height + "px";
		this.overcanvas.style.top += height + "px";
	},

	setTemplateWidth: function (widthTemplate) {

		var width = parseInt(widthTemplate.value, 10);
		
		this.templateWidth = width;

		if (!this.checkSizeTemplate()) {
			return this.setStatus(true, "Szerokość szablonu jest za wysoka");
		} else {
			this.status.style.display = "none";
		}

		this.overcanvas.style.width = width + "px";
	},

	setTemplateMarginTop: function (marginTop) {

		var top = parseInt(marginTop.value, 10),
			margin = -this.canvasHeight + top;

		this.templateMarginTop = top;

		if (!this.checkSizeTemplate()) {
			return this.setStatus(true, "Górny marginesu jest za duży");
		} else {
			this.status.style.display = "none";
		}

		this.overcanvas.style.top = margin + "px";
	},

	setTemplateMarginLeft: function (marginLeft) {

		var left = parseInt(marginLeft.value, 10);

		this.templateMarginLeft = left; 

		if (!this.checkSizeTemplate()) {
			return this.setStatus(true, "Lewy margines jest za duży");
		} else {
			this.status.style.display = "none";
		}

		this.overcanvas.style.left = left + "px";
	},

	setCircleRadius: function (circleRadius) {

		var radius = parseInt(circleRadius.value, 10);

		this.circleRadius = radius;
		this.circle.radius = this.circleRadius;
		this.circle.height = radius * 2;
		this.circle.width = radius * 2;
		this.canvas.renderAll();
	},

	setCircleMarginTop: function (marginTopCircle) {

		var marginTop = parseInt(marginTopCircle.value, 10);

		this.circleMarginTop = marginTop;
		this.circle.top = this.circleMarginTop;
		this.canvas.renderAll();
	},

	setCircleMarginLeft: function (marginLeftCircle) {

		var marginLeft = parseInt(marginLeftCircle.value, 10);

		this.circleMarginLeft = marginLeft;
		this.circle.left = this.circleMarginLeft;
		this.canvas.renderAll();
	},

	setCircleFill: function (fillCircle) {

		var fill = fillCircle.value;

		this.circleFill = fill;
		this.circle.fill = this.circleFill;
		this.canvas.renderAll();
	},

	updateProgressStatus: function(total, loaded) {

        var percentLoaded = (loaded / total) * 100;

        this.progressStatus.style.width = percentLoaded.toFixed(0) + "%";
        this.progressStatus.innerHTML = percentLoaded.toFixed(0) + "%";
	},

	checkSizeTemplate: function() {

		var hTemplateMarginTop = this.templateHeight + this.templateMarginTop,
			wTemplateMarginLeft = this.templateWidth + this.templateMarginLeft;

		if (hTemplateMarginTop > this.canvasHeight) {
			this.generateTemplateButton.onclick = null;
        	this.generateTemplateButton.setAttribute("disabled", "disabled");
			return false;
		}

		if (wTemplateMarginLeft > this.canvasWidth) {
			this.generateTemplateButton.onclick = null;
        	this.generateTemplateButton.setAttribute("disabled", "disabled");
			return false;
		}

		this.generateTemplateButton.onclick = true;
        this.generateTemplateButton.removeAttribute("disabled");
		return true;
	},

	addImagesFolder: function (e) {
 
		var folder;

		this.imagesFolder = e.target.files;
		folder = this.imagesFolder[0].webkitRelativePath.split("/");
		this.folderName = folder[0];
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
                CT.canvas.add(image);
                CT.canvas.renderAll.bind(CT.canvas);
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
					left: this.templateMarginLeft,
					top: this.templateMarginTop,
					height: this.templateHeight,
					width: this.templateWidth
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
			format: this.imageType,
			left: this.templateMarginLeft,
			top: this.templateMarginTop,
			height: this.templateHeight,
			width: this.templateWidth
		});

		image.append("image", template);
		image.append("nameImage", this.image.name);
		image.append("nameFolder", this.folderName);

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
		        if (this.imagesFolder.length >= this.imageNumber) {
		        	
		        	this.imageNumber++;
		        	this.updateProgressStatus(this.imagesFolder.length, this.imageNumber);
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

		if (typeof this.imagesFolder[this.imageNumber] != "undefined") {
			this.image = this.imagesFolder[this.imageNumber];
		} else {
			this.setStatus(false, "Generowanie templejtów zostało zakończone.")
		}
		
		this.addImageToCanvas(CT.saveTemplate, CT);
	},

	addCircleToCanvas: function (e) {
		
		//this.addTextToCanvas(e);
		if (e.target.checked) { 
			this.circle = new fabric.Circle({ 
        		top: this.circleMarginTop, 
        		left: this.circleMarginLeft, 
        		radius: this.circleRadius, 
        		fill: this.circleFill
        	});

			this.canvas.add(this.circle);
		} else {
			this.canvas.remove(this.circle);
		}
	},

	addTextToCanvas: function (e) {

		if (e.target.checked) { 
			//CT.text = new fabric.IText(1);

			this.canvas.add(new fabric.IText(1));
		} else {
			this.canvas.remove(this.text);
		}
	},

	init: function () {

		//var counterNumber = document.querySelector("#counternumber");
		var templateImg = document.querySelector("#template-img");
		var uploadFolder = document.querySelector("#upload-folder");
		var templateHeight = document.querySelector("#template-height");
		var templateWidth = document.querySelector("#template-width");

		var templateMarginTop = document.querySelector("#template-margin-top");
		var templateMarginLeft = document.querySelector("#template-margin-left");

		var addCircle = document.querySelector("#add-circle");
		var circleRadius = document.querySelector("#circle-radius");
		var circleMarginTop = document.querySelector("#circle-margin-top");
		var circleMarginLeft = document.querySelector("#circle-margin-left");
		var circleFill = document.querySelector("#circle-fill");

		this.generateTemplateButton = document.querySelector("#generatetemplate");

		//counterNumber.addEventListener("change", CT.setCounter, 'false');
		templateImg.addEventListener("change", CT.addTemplateImage, 'false');
		uploadFolder.addEventListener("change", function () { CT.addImagesFolder(event); }, 'false');

		templateHeight.addEventListener("change", function () { CT.setTemplateHeight(templateHeight); }, 'false');
		templateWidth.addEventListener("change", function () { CT.setTemplateWidth(templateWidth); }, 'false');

		templateMarginTop.addEventListener("change", function () { CT.setTemplateMarginTop(templateMarginTop); }, 'false');
		templateMarginLeft.addEventListener("change", function () { CT.setTemplateMarginLeft(templateMarginLeft); }, 'false');

		addCircle.addEventListener("change", function () { CT.addCircleToCanvas(event); CT.addTextToCanvas(event); }, 'false');
		circleRadius.addEventListener("change", function () { CT.setCircleRadius(circleRadius); }, 'false');
		circleMarginTop.addEventListener("change", function () { CT.setCircleMarginTop(circleMarginTop); }, 'false');
		circleMarginLeft.addEventListener("change", function () { CT.setCircleMarginLeft(circleMarginLeft); }, 'false');
		circleFill.addEventListener("change", function () { CT.setCircleFill(circleFill); }, 'false');

		this.generateTemplateButton.addEventListener("click", this.generateTemplate.bind(this), 'false');

		this.canvasHeight = this.canvas.height;
		this.canvasWidth = this.canvas.width;
		this.overcanvas.style.top = -this.canvasHeight + "px";

		this.progressStatus = document.querySelector('#progress-status');
	}
};

CT.init();

}(window, CT));