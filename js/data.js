"use strict";

(function() {
	window.data = {
		createPinElements: function(response) {
			response.forEach(announcementObject => {
				let similarPin = pin.cloneNode(true);
				let image = similarPin.querySelector("img");
				similarPin.style.left =
					announcementObject["location"]["x"] -
					Math.round(image.width / 2) +
					"px";
				similarPin.style.top =
					announcementObject["location"]["y"] -
					image.height -
					PIN_SPIKE_HEIGHT +
					"px";
				image.src = announcementObject["author"]["avatar"];
				image.alt = announcementObject["offer"]["title"];
				similarPin.classList.add("hidden");

				window.data["pinElements"].push(similarPin);
			});
		},
		createAnnouncementElements: function(response) {
			response.forEach(announcementObject => {
				let announcement = mapCard.cloneNode(true);
				let popupTitle = announcement.querySelector("h3");
				let popupAddress = announcement.querySelector("small");
				let popupPrice = announcement.querySelector(".popup__price");
				let popupType = announcement.querySelector("h4");
				let popupCapacity = announcement.querySelectorAll("p")[2];
				let popupTime = announcement.querySelectorAll("p")[3];
				let popupFeatures = announcement.querySelector(
					".popup__features"
				);
				let popupDescription = announcement.querySelectorAll("p")[4];
				let popupPhotos = announcement.querySelector(
					".popup__pictures"
				);
				let popupAvatar = announcement.querySelector(".popup__avatar");
				let photoItem = popupPhotos.querySelector("li");

				popupTitle.classList.add("popup__title");
				popupTitle.textContent = announcementObject["offer"]["title"];

				popupAddress.classList.add("popup__text--address");
				popupAddress.textContent =
					announcementObject["offer"]["address"];

				popupPrice.classList.add("popup__text--price");
				popupPrice.textContent = `${announcementObject["offer"]["price"]}₽/ночь`;

				popupType.classList.add("popup__type");
				popupType.textContent =
					typeMap[announcementObject["offer"]["type"]];

				popupCapacity.classList.add("popup__text--capacity");
				if (
					announcementObject["offer"]["rooms"] &&
					announcementObject["offer"]["guests"]
				) {
					popupCapacity.textContent = `${announcementObject["offer"]["rooms"]} комнаты для ${announcementObject["offer"]["guests"]} гостей`;
				} else {
					popupCapacity.remove();
				}

				popupTime.classList.add("popup__text--time");
				popupTime.textContent = `Заезд после ${announcementObject["offer"]["checkin"]}, выезд до ${announcementObject["offer"]["checkout"]}`;

				for (let j = 0; j < popupFeatures.children.length; j++) {
					popupFeatures.children[
						j
					].style.display = announcementObject["offer"][
						"features"
					].includes(
						popupFeatures.children[j].classList[1].split("--")[1]
					)
						? ""
						: "none";
				}

				popupDescription.classList.add("popup__description");
				popupDescription.textContent =
					announcementObject["offer"]["description"];

				popupPhotos.classList.add("popup__photos");
				if (announcementObject["offer"]["photos"].length) {
					photoItem.firstElementChild.src =
						announcementObject["offer"]["photos"][0];

					for (
						let j = 1;
						j < announcementObject["offer"]["photos"].length;
						j++
					) {
						let photo = photoItem.cloneNode(true);
						let image = photo.firstElementChild;
						image.src = announcementObject["offer"]["photos"][j];
						popupPhotos.append(photo);
					}
				} else {
					popupPhotos.remove();
				}

				popupAvatar.src = announcementObject["author"]["avatar"];

				announcement.style.left = ANNOUNCEMENT_COORD_X + "px";
				announcement.style.top = ANNOUNCEMENT_COORD_Y + "px";
				announcement.classList.add("hidden");

				window.data["announcementElements"].push(announcement);
			});
		},
		announcementElements: [],
		pinElements: []
	};

	const ANNOUNCEMENT_COORD_X = 50;
	const ANNOUNCEMENT_COORD_Y = 90;
	const PIN_SPIKE_HEIGHT = 18;
	let template = document.querySelector("template").content;
	let typeMap = {
		flat: "Квартира",
		bungalo: "Бунгало",
		house: "Дом",
		palace: "Дворец"
	};
	let mapCard = template.querySelector(".map__card");
	let pin = template.querySelector(".map__pin");
})();
