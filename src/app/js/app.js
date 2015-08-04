var CT = CT || {};

(function (w, ct) {

CT = {

	/*** CANVAS ***/
	template: {
		canvas: new fabric.Canvas('createtemplate'),
		canvasHeight: 0,
		canvasWidth: 0,
		height: 0,
		width: 0,
		marginTop: 0,
		marginLeft: 0
	},

	/*** CIRCLE ***/
	circleRadius: 50,
	circleFill: 'red',
	circleMarginTop: 0,
	circleMarginLeft: 0,
	
	/*** FILE & FOLDER ***/
	imagesFolder: {},
	image: null,
	imageType: 'jpeg',
	imageNumber: 0, 
	folderName: null,
	textNumber: '1',

	status: document.querySelector("#status"),
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

	/***** SET WIDTH, HEIGHT, TOP AND LEFT *****/
	setTemplateHeight: function (heightTemplate) {

		var height = parseInt(heightTemplate.value, 10);

		this.template.height = height;

		if (!this.checkSizeTemplate()) {
			return this.setStatus(true, "The height of the template is too big");
		} else {
			this.status.style.display = "none";
		}

		this.overcanvas.style.height = height + "px";
		this.overcanvas.style.top += height + "px";
	},

	setTemplateWidth: function (widthTemplate) {

		var width = parseInt(widthTemplate.value, 10);
		
		this.template.width = width;

		if (!this.checkSizeTemplate()) {
			return this.setStatus(true, "The width of the template is too big");
		} else {
			this.status.style.display = "none";
		}

		this.overcanvas.style.width = width + "px";
	},

	setTemplateMarginTop: function (marginTop) {

		var top = parseInt(marginTop.value, 10),
			margin = -this.template.canvasHeight + top;

		this.template.marginTop = top;

		if (!this.checkSizeTemplate()) {
			return this.setStatus(true, "The top margin is too big");
		} else {
			this.status.style.display = "none";
		}

		this.overcanvas.style.top = margin + "px";
	},

	setTemplateMarginLeft: function (marginLeft) {

		var left = parseInt(marginLeft.value, 10);

		this.template.marginLeft = left; 

		if (!this.checkSizeTemplate()) {
			return this.setStatus(true, "The left margin is too big");
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

		this.text.left = this.circle.radius - (this.text.width/2);
		this.text.top = this.circle.radius - (this.text.height/2);

		this.template.canvas.renderAll();
	},

	setCircleMarginTop: function (marginTopCircle) {

		var marginTop = parseInt(marginTopCircle.value, 10);

		this.circleMarginTop = marginTop;
		this.circle.top = this.circleMarginTop;

		this.text.top = this.circle.top + this.circle.radius - (this.text.height/2);

		this.template.canvas.renderAll();
	},

	setCircleMarginLeft: function (marginLeftCircle) {

		var marginLeft = parseInt(marginLeftCircle.value, 10);

		this.circleMarginLeft = marginLeft;
		this.circle.left = this.circleMarginLeft;

		this.text.left = this.circle.left + this.circle.radius - (this.text.width/2);

		this.template.canvas.renderAll();
	},

	setCircleFill: function (fillCircle) {

		var fill = fillCircle.value;

		this.circleFill = fill;
		this.circle.fill = this.circleFill;
		this.template.canvas.renderAll();
	},

	setTextFill: function (fillText) {

		var fill = fillText.value;

		this.textFill = fill;
		this.text.fill = this.textFill;
		this.template.canvas.renderAll();
	},

	setTextNumber: function (numberText) {

		if (typeof numberText.value != 'undefined') {
			var number = String(parseInt(numberText.value, 10));
		} else {
			var number = String(parseInt(numberText, 10));
		}

		this.text.text = number;
		this.textNumber = number;
		this.template.canvas.renderAll();

		this.text.left = this.circle.left + this.circle.radius - (this.text.width/2);
		this.text.top = this.circle.top + this.circle.radius - (this.text.height/2);
		this.template.canvas.renderAll();
	},

	updateProgressStatus: function(total, loaded) {

        var percentLoaded = (loaded / total) * 100;

        this.progressStatus.style.width = percentLoaded.toFixed(0) + "%";
        this.progressStatus.innerHTML = percentLoaded.toFixed(0) + "%";
	},

	checkSizeTemplate: function() {

		var hTemplateMarginTop = this.template.height + this.template.marginTop,
			wTemplateMarginLeft = this.template.width + this.template.marginLeft;

		if (hTemplateMarginTop > this.template.canvasHeight) {
			this.generateTemplateButton.onclick = null;
        	this.generateTemplateButton.setAttribute("disabled", "disabled");
			return false;
		}

		if (wTemplateMarginLeft > this.template.canvasWidth) {
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
			imgObj,
			image;

        reader.onload = function (event) {
            imgObj = new Image();
            imgObj.src = event.target.result;
            imgObj.onload = function () {

                image = new fabric.Image(imgObj);
                CT.template.canvas.setWidth(image.width);
    			CT.template.canvas.setHeight(image.height);
                CT.template.canvas.add(image);
                CT.template.canvasHeight = CT.template.canvas.height;
				CT.template.canvasWidth = CT.template.canvas.width;
				CT.overcanvas.style.top = -CT.template.canvasHeight + "px";
                CT.template.canvas.renderAll.bind(CT.template.canvas);
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
					left: this.template.marginLeft,
					top: this.template.marginTop,
					height: this.template.height,
					width: this.template.width
				});

				if (this.template.canvas.add(image)) {

					this.template.canvas.bringToFront(this.circle);
					this.template.canvas.bringToFront(this.text); 
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

		this.template.canvas.deactivateAll().renderAll();

		template = this.template.canvas.toDataURL ({
			multiplier: 1,
			quality: 1,
			format: this.imageType,
			left: this.template.marginLeft,
			top: this.template.marginTop,
			height: this.template.height,
			width: this.template.width
		});

		image.append("image", template);
		image.append("nameImage", this.image.name);
		image.append("nameFolder", this.folderName);

		xhr = new XMLHttpRequest();

        xhr.open("POST", "app/saveimage.php", true);

        xhr.onload = function (e) {

            if (e.target.status != 200) {
                this.setStatus(true, "An error occurred!");
            }
        };

        xhr.send(image);

        xhr.onreadystatechange = function () {
		    if (xhr.readyState == 4 && xhr.status == 200) {
		        if (this.imagesFolder.length >= this.imageNumber) {
		        	
		        	this.setTextNumber(parseInt(this.text.text) + 1);
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
			this.setStatus(false, "Generating templates has been completed.");
		}
		
		this.addImageToCanvas(CT.saveTemplate, CT);
	},

	addCircleToCanvas: function (e) {
		
		if (e.target.checked) { 
			this.circle = new fabric.Circle({ 
        		top: this.circleMarginTop, 
        		left: this.circleMarginLeft, 
        		radius: this.circleRadius, 
        		fill: this.circleFill
        	});

			this.template.canvas.add(this.circle);
		} else {
			this.template.canvas.remove(this.circle);
		}
	},

	addTextToCanvas: function (e) {

		if (e.target.checked) { 
			this.text = new fabric.IText(this.textNumber, {
				fontFamily: 'helvetica',
				fontWeight: 'bold',
				fontSize: 28,
				fill: 'black',
			});

			this.template.canvas.add(this.text);
			this.text.left = this.circle.radius - (this.text.width/2);
			this.text.top = this.circle.radius - (this.text.height/2);
			this.template.canvas.renderAll();
		} else {
			this.canvas.remove(this.text);
		}
	},

	init: function () {

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

		var textFill = document.querySelector("#text-fill");
		var textNumber = document.querySelector("#text-number");

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

		textFill.addEventListener("change", function () { CT.setTextFill(textFill); }, 'false');
		textNumber.addEventListener("change", function () { CT.setTextNumber(textNumber); }, 'false');

		this.template.canvasHeight = this.template.canvas.height;
		this.template.canvasWidth = this.template.canvas.width;
		this.overcanvas.style.top = -this.template.canvasHeight + "px";

		this.progressStatus = document.querySelector('#progress-status');
		this.generateTemplateButton = document.querySelector("#generatetemplate");
		this.generateTemplateButton.addEventListener("click", this.generateTemplate.bind(this), 'false');
	}
};

CT.init();

}(window, CT));