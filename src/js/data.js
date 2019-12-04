const data = {
	createPinElements(response) {
		response.forEach((announcementObject) => {
			const similarPin = pin.cloneNode(true);
			const image = similarPin.querySelector(`img`);
			similarPin.style.left =
				announcementObject[`location`][`x`] -
				Math.round(image.width / 2) +
				`px`;
			similarPin.style.top =
				announcementObject[`location`][`y`] -
				image.height -
				PIN_SPIKE_HEIGHT +
				`px`;
			image.src = announcementObject[`author`][`avatar`];
			image.alt = announcementObject[`offer`][`title`];
			similarPin.classList.add(`hidden`);

			data[`pinElements`].push(similarPin);
		});
	},
	createAnnouncementElements(response) {
		response.forEach((announcementObject) => {
			const announcement = mapCard.cloneNode(true);
			const popupTitle = announcement.querySelector(`h3`);
			const popupAddress = announcement.querySelector(`small`);
			const popupPrice = announcement.querySelector(`.popup__price`);
			const popupType = announcement.querySelector(`h4`);
			const popupCapacity = announcement.querySelectorAll(`p`)[2];
			const popupTime = announcement.querySelectorAll(`p`)[3];
			const popupFeatures = announcement.querySelector(
				`.popup__features`
			);
			const popupDescription = announcement.querySelectorAll(`p`)[4];
			const popupPhotos = announcement.querySelector(`.popup__pictures`);
			const popupAvatar = announcement.querySelector(`.popup__avatar`);
			const photoItem = popupPhotos.querySelector(`li`);

			popupTitle.classList.add(`popup__title`);
			popupTitle.textContent = announcementObject[`offer`][`title`];

			popupAddress.classList.add(`popup__text--address`);
			popupAddress.textContent = announcementObject[`offer`][`address`];

			popupPrice.classList.add(`popup__text--price`);
			popupPrice.textContent = `${announcementObject[`offer`][`price`]}₽/ночь`;

			popupType.classList.add(`popup__type`);
			popupType.textContent =
				TYPE_MAP[announcementObject[`offer`][`type`]];

			popupCapacity.classList.add(`popup__text--capacity`);
			if (
				announcementObject[`offer`][`rooms`] &&
				announcementObject[`offer`][`guests`]
			) {
				popupCapacity.textContent = `${announcementObject[`offer`][`rooms`]} комнаты для ${announcementObject[`offer`][`guests`]} гостей`;
			} else {
				popupCapacity.remove();
			}

			popupTime.classList.add(`popup__text--time`);
			popupTime.textContent = `Заезд после ${announcementObject[`offer`][`checkin`]}, выезд до ${announcementObject[`offer`][`checkout`]}`;

			for (let j = 0; j < popupFeatures.children.length; j++) {
				popupFeatures.children[j].style.display = announcementObject[
					`offer`
				][`features`].includes(
					popupFeatures.children[j].classList[1].split(`--`)[1]
				)
					? ``
					: `none`;
			}

			popupDescription.classList.add(`popup__description`);
			popupDescription.textContent =
				announcementObject[`offer`][`description`];

			popupPhotos.classList.add(`popup__photos`);
			if (announcementObject[`offer`][`photos`].length) {
				photoItem.firstElementChild.src =
					announcementObject[`offer`][`photos`][0];

				for (
					let j = 1;
					j < announcementObject[`offer`][`photos`].length;
					j++
				) {
					const photo = photoItem.cloneNode(true);
					const image = photo.firstElementChild;
					image.src = announcementObject[`offer`][`photos`][j];
					popupPhotos.append(photo);
				}
			} else {
				popupPhotos.remove();
			}

			popupAvatar.src = announcementObject[`author`][`avatar`];

			announcement.style.left = ANNOUNCEMENT_COORD_X + `px`;
			announcement.style.top = ANNOUNCEMENT_COORD_Y + `px`;
			announcement.classList.add(`hidden`);

			data[`announcementElements`].push(announcement);
		});
	},
	announcementElements: [],
	pinElements: []
};

const ANNOUNCEMENT_COORD_X = 50;
const ANNOUNCEMENT_COORD_Y = 90;
const PIN_SPIKE_HEIGHT = 18;
const TYPE_MAP = {
	flat: `Квартира`,
	bungalo: `Бунгало`,
	house: `Дом`,
	palace: `Дворец`
};
const template = document.querySelector(`template`).content;
const mapCard = template.querySelector(`.map__card`);
const pin = template.querySelector(`.map__pin`);

export default data;
