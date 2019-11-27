"use strict";

(function() {
	const FILE_FORMATS = ["png", "jpeg", "jpg", "gif"];
	let avatarPreview = window.form["form"].querySelector(".notice__preview");
	let imagesContainer = window.form["form"].querySelector(
		".form__photo-container"
	);
	let avatarInput = window.form["form"].avatar;
	let imagesInput = window.form["form"].images;
	let avatarPic = avatarPreview.firstElementChild;

	function isMathes(fileName) {
		return FILE_FORMATS.some(fileFormat => fileName.endsWith(fileFormat));
	}

	imagesInput.addEventListener("change", function() {
		let images = imagesInput.files;

		for (let image of images) {
			let imageName = image.name.toLowerCase();

			if (isMathes(imageName)) {
				let reader = new FileReader();
				let picture = document.createElement("img");
				picture.width = 100;

				reader.addEventListener("load", function() {
					picture.src = reader.result;
					imagesContainer.append(picture);
				});
				reader.readAsDataURL(image);
			}
		}
	});

	avatarInput.addEventListener("change", function() {
		let avatarFile = avatarInput.files[0];
		let avatarFileName = avatarFile.name.toLowerCase();

		if (isMathes(avatarFileName)) {
			let reader = new FileReader();

			reader.addEventListener("load", function() {
				avatarPic.src = reader.result;
			});
			reader.readAsDataURL(avatarFile);
		}
	});
})();
