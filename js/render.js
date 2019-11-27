"use strict";

(function() {
	window.render = {
		render: function(announcementsArray, pinsArray) {
			let pinsFragment = document.createDocumentFragment();
			let announcementsFragment = document.createDocumentFragment();

			pinsArray.forEach(pinElement => {
				pinsFragment.append(pinElement);
			});
			announcementsArray.forEach(announcementElement => {
				announcementElement.classList.add("hidden");
				announcementsFragment.append(announcementElement);
			});
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

	let map = document.querySelector(".map");
	let mapPins = map.querySelector(".map__pins");
})();
