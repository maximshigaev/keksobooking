("use strict");

(function() {
	window.render = {
		render: function(announcementsArray, pinsArray) {
			let pinsFragment = document.createDocumentFragment();
			let announcementsFragment = document.createDocumentFragment();

			pinsArray.forEach(pinElement => {
				// pinElement.classList.add("hidden");
				// pinElement.hidden = true;
				pinsFragment.append(pinElement);
			});
			announcementsArray.forEach(announcementElement =>
				announcementsFragment.append(announcementElement)
			);
			mapPins.append(pinsFragment);
			map.insertBefore(
				announcementsFragment,
				map.querySelector(".map__filters-container")
			);

			for (let i = 0; i < pinsArray.length; i++) {
				pinsArray[i].addEventListener("click", function() {
					announcementsArray.forEach(announcement => {
						announcement.classList.add("hidden");
						announcement.classList.remove("map__pin--active");
					});
					announcementsArray[i].classList.remove("hidden");
					announcementsArray[i].classList.add("map__pin--active");

					window.addEventListener(
						"keydown",
						pinElementKeydownHandler
					);

					function pinElementKeydownHandler(evt) {
						if (evt.code === "Escape") {
							announcementsArray[i].classList.add("hidden");
							announcementsArray[i].classList.remove(
								"map__pin--active"
							);
							window.removeEventListener(
								"keydown",
								pinElementKeydownHandler
							);
						}
					}
				});
			}

			let closeButtons = document.querySelectorAll(".popup__close");

			for (let i = 0; i < closeButtons.length; i++) {
				closeButtons[i].addEventListener("click", function() {
					announcementsArray[i].classList.add("hidden");
					announcementsArray[i].classList.remove("map__pin--active");
				});
			}
		},
		actualPins: []
	};

	// const NUMBER_OF_ANNOUNCEMENTS = 5;
	// let actualAnnouncements = [];
	let map = document.querySelector(".map");
	let mapPins = map.querySelector(".map__pins");

	// function successLoadCallback(response) {
	// 	let announcementObjects = response;
	// 	window.data["createPinElements"](announcementObjects);
	// 	window.data["createAnnouncementElements"](announcementObjects);

	// 	for (let i = 0; i < NUMBER_OF_ANNOUNCEMENTS; i++) {
	// 		let announcementNumber = Math.floor(
	// 			Math.random() * window.data["announcementElements"].length
	// 		);
	// 		if (
	// 			!actualAnnouncements.includes(
	// 				window.data["announcementElements"][announcementNumber]
	// 			)
	// 		) {
	// 			actualAnnouncements.push(
	// 				window.data["announcementElements"][announcementNumber]
	// 			);
	// 			window.render["actualPins"].push(
	// 				window.data["pinElements"][announcementNumber]
	// 			);
	// 		} else {
	// 			i--;
	// 			continue;
	// 		}
	// 	}

	// 	window.render["render"](
	// 		actualAnnouncements,
	// 		window.render["actualPins"]
	// 	);
	// }

	// function failLoadCallback(errorMessage) {
	// 	notification.classList.remove("hidden");
	// 	notification.textContent = errorMessage;
	// 	notification.style.color = "red";
	// 	setTimeout(() => notification.classList.add("hidden"), TIMEOUT);
	// }

	// window.backend["load"](successLoadCallback, failLoadCallback);
})();
