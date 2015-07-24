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
	filesAdded: 0,
	formData: new FormData(),

	images: [],

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
	},

	addEventListener: function () {
	},

	addFolderImages: function (e) {

		this.folderImages = e.target.files;

		[].forEach.call(this.folderImages, function (file) {
			this.addToUploadList(file);
			this.addImages(file);
		}.bind(this));

	},

	addImages: function (file) {

		this.images.push(file);

	},

	addToUploadList: function (file) {

		this.formData.append("images[]", file);
		this.filesAdded++;

	},

	addTemplateImage: function (e) {

		var reader = new FileReader(),
			percentComplete,
			imgObj,
			image;

		reader.onprogress = function (evt) {
            percentComplete = (evt.loaded / evt.total) * 100;
            console.log(percentComplete);
        }

        reader.onload = function (event) {
            imgObj = new Image();
            imgObj.src = event.target.result;
            imgObj.onload = function() {

                image = new fabric.Image(imgObj);
                CT.canvas.setWidth(image.width);
    			CT.canvas.setHeight(image.height);
                CT.canvas.setOverlayImage(image, CT.canvas.renderAll.bind(CT.canvas));
                CT.init();
            }
        }

        reader.readAsDataURL(e.target.files[0]);        
	},

	sendFiles: function () {

		var xhr,
			responseObject;

		if (this.filesAdded == 0) return;

		//this.sendButton.onclick = null;
        //this.sendButton.setAttribute("disabled", "disabled");

        xhr = new XMLHttpRequest();

        xhr.open("POST", "app/image_uploader.php", true);

        xhr.onload = function (e) {

            if (e.target.status != 200) {
                this.setStatus(true, "Wystąpił błąd!");
            }

            //responseObject = JSON.parse(e.target.responseText);
            //this.setStatus(responseObject.error, responseObject.message);

        }.bind(this);

        //xhr.onprogress = this.updateProgress.bind(this);

        xhr.send(this.formData);
	},

	addImageToCanvas: function (src) {

		var reader = new FileReader();

		reader.onload = function () {
			var imgObj = new Image();
			imgObj.src = reader.result;

			imgObj.onload = function () {

				console.log(this.marginTop);

				var image = new fabric.Image(imgObj);
				image.set({
					left: this.marginLeft,
					top: this.marginTop,
					height: this.heightTemplate,
					width: this.widthTemplate
				});

				CT.canvas.add(image);
			}.bind(this);

		}.bind(this);
		reader.readAsDataURL(CT.images[0]);



		/*var oImg,
			top;
		var reader = new FileReader(),
            img = new Image();

        reader.onload = function() {
            img.src = reader.result;
        }

        //console.log(reader.readAsDataURL(CT.images[0]));

        reader.readAsDataURL(CT.images[0]);

        console.log(img)
        var image = new fabric.Image(img);
        image.set({
                left: 0,
                top: 0
            });
        
       CT.canvas.add(image);
       CT.canvas.renderAll();

		fabric.Image.fromURL(src, function (img) {

			oImg = img.set({
				left: 0,
				top: 0
			});

			CT.canvas.add(oImg);

		});*/

	},

	generateTemplate: function () {

		//CT.sendFiles();

		//console.log(this.formData.get());

		if (this.filesAdded == 0) return;

		CT.addImageToCanvas();


	},

	init: function () {

		var counterNumber = document.querySelector("#counternumber");
		var fileTemplate = document.querySelector("#filetemplate");
		var folderUpload = document.querySelector("#folderupload");
		var heightTemplate = document.querySelector("#heighttemplate");
		var widthTemplate = document.querySelector("#widthtemplate");

		var marginTop = document.querySelector("#margintop");
		var marginLeft = document.querySelector("#marginleft");

		var generateTemplateButton = document.querySelector("#generatetemplate");


		counterNumber.addEventListener("change", CT.setCounter, 'false');
		fileTemplate.addEventListener("change", CT.addTemplateImage, 'false');
		folderUpload.addEventListener("change", function () { CT.addFolderImages(event)}, 'false');

		heightTemplate.addEventListener("change", function () { CT.setHeightTemplate(heightTemplate);}, 'false');
		widthTemplate.addEventListener("change", function () { CT.setWidthTemplate(widthTemplate);}, 'false');

		marginTop.addEventListener("change", function () { CT.setMarginTop(marginTop);}, 'false');
		marginLeft.addEventListener("change", function () { CT.setMarginLeft(marginLeft);}, 'false');

		generateTemplateButton.addEventListener("click", CT.generateTemplate, 'false');


		this.heightCanvas = this.canvas.height;
		this.widthCanvas = this.canvas.width;
		this.overcanvas.style.top = -this.heightCanvas + "px";
	}
};

CT.init();

}(window, CT));