import form from "./form.js";

function upload() {
	const FILE_FORMATS = [`png`, `jpeg`, `jpg`, `gif`];
	const avatarPreview = form[`form`].querySelector(`.notice__preview`);
	const imagesContainer = form[`form`].querySelector(
		`.form__photo-container`
	);
	const avatarInput = form[`form`].avatar;
	const imagesInput = form[`form`].images;
	const avatarPic = avatarPreview.firstElementChild;

	function isMathes(fileName) {
		return FILE_FORMATS.some((fileFormat) => fileName.endsWith(fileFormat));
	}

	imagesInput.addEventListener(`change`, function () {
		const images = imagesInput.files;

		for (let image of images) {
			const imageName = image.name.toLowerCase();

			if (isMathes(imageName)) {
				const reader = new FileReader();
				const picture = document.createElement(`img`);
				picture.width = 100;

				reader.addEventListener(`load`, function () {
					picture.src = reader.result;
					imagesContainer.append(picture);
				});
				reader.readAsDataURL(image);
			}
		}
	});

	avatarInput.addEventListener(`change`, function () {
		const avatarFile = avatarInput.files[0];
		const avatarFileName = avatarFile.name.toLowerCase();

		if (isMathes(avatarFileName)) {
			const reader = new FileReader();

			reader.addEventListener(`load`, function () {
				avatarPic.src = reader.result;
			});
			reader.readAsDataURL(avatarFile);
		}
	});
}

export default upload;
