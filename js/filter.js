"use strict";

(function() {
	window.filter = function() {
		function concat() {
			let startAnnouncements = document.querySelectorAll(".map__card");
			let startPins = document.querySelectorAll(".map__pin");

			filteredAnnouncements.length = 0;
			filteredPins.length = 0;
			for (
				let i = 0;
				i < window.data["announcementElements"].length;
				i++
			) {
				if (
					housingTypeAnnouncements.includes(
						window.data["announcementElements"][i]
					) &&
					housingPriceAnnouncements.includes(
						window.data["announcementElements"][i]
					) &&
					housingRoomsAnnouncements.includes(
						window.data["announcementElements"][i]
					) &&
					housingGuestsAnnouncements.includes(
						window.data["announcementElements"][i]
					) &&
					featuresAnnouncements.includes(
						window.data["announcementElements"][i]
					)
				) {
					filteredAnnouncements.push(
						window.data["announcementElements"][i]
					);
					filteredPins.push(window.data["pinElements"][i]);
				}
			}

			for (let i = 1; i < startPins.length; i++) {
				startPins[i].remove();
			}

			startAnnouncements.forEach(startAnnouncement =>
				startAnnouncement.remove()
			);

			filteredPins.forEach(filteredPin => {
				filteredPin.classList.remove("hidden");
			});

			if (filteredAnnouncements.length > NUMBER_OF_ANNOUNCEMENTS) {
				let filteredLongAnnouncements = [];
				let filteredLongPins = [];

				for (let i = 0; i < NUMBER_OF_ANNOUNCEMENTS; i++) {
					let index = Math.floor(
						Math.random() * filteredAnnouncements.length
					);

					if (
						!filteredLongAnnouncements.includes(
							filteredAnnouncements[index]
						)
					) {
						filteredLongAnnouncements.push(
							filteredAnnouncements[index]
						);
						filteredLongPins.push(filteredPins[index]);
					} else {
						i--;
					}
				}
				window["debounce"](
					window.render["render"],
					filteredLongAnnouncements,
					filteredLongPins
				)();
			} else {
				window["debounce"](
					window.render["render"],
					filteredAnnouncements,
					filteredPins
				)();
			}
		}

		let housingTypeAnnouncements = window.data[
			"announcementElements"
		].slice();

		housingTypeFilter.addEventListener("change", function() {
			housingTypeAnnouncements.length = 0;

			for (
				let i = 0;
				i < window.data["announcementElements"].length;
				i++
			) {
				let housingType = window.data["announcementElements"][
					i
				].querySelector(".popup__type").textContent;
				let selectedType =
					housingTypeFilter.children[housingTypeFilter.selectedIndex]
						.textContent;
				if (
					!housingTypeFilter.selectedIndex ||
					housingType === selectedType
				) {
					housingTypeAnnouncements.push(
						window.data["announcementElements"][i]
					);
				}
			}

			concat();
		});

		let housingPriceAnnouncements = window.data[
			"announcementElements"
		].slice();

		housingPriceFilter.addEventListener("change", function() {
			housingPriceAnnouncements.length = 0;

			for (
				let i = 0;
				i < window.data["announcementElements"].length;
				i++
			) {
				let price = parseInt(
					window.data["announcementElements"][i].querySelector(
						".popup__price"
					).textContent
				);

				switch (housingPriceFilter.selectedIndex) {
					case 0:
						housingPriceAnnouncements.push(
							window.data["announcementElements"][i]
						);
						break;
					case 1:
						if (
							price >= HOUSING_PRICE_MIN &&
							price <= HOUSING_PRICE_MAX
						) {
							housingPriceAnnouncements.push(
								window.data["announcementElements"][i]
							);
						}
						break;
					case 2:
						if (price < HOUSING_PRICE_MIN) {
							housingPriceAnnouncements.push(
								window.data["announcementElements"][i]
							);
						}
						break;
					case 3:
						if (price > HOUSING_PRICE_MAX) {
							housingPriceAnnouncements.push(
								window.data["announcementElements"][i]
							);
						}
						break;
				}
			}

			concat();
		});

		let housingRoomsAnnouncements = window.data[
			"announcementElements"
		].slice();

		housingRoomsFilter.addEventListener("change", function() {
			housingRoomsAnnouncements.length = 0;

			for (
				let i = 0;
				i < window.data["announcementElements"].length;
				i++
			) {
				let roomsNumber = announcementObjects[i]["offer"]["rooms"];

				if (
					!housingRoomsFilter.selectedIndex ||
					+housingRoomsFilter.value === roomsNumber
				) {
					housingRoomsAnnouncements.push(
						window.data["announcementElements"][i]
					);
				}
			}

			concat();
		});

		let housingGuestsAnnouncements = window.data[
			"announcementElements"
		].slice();

		housingGuestsFilter.addEventListener("change", function() {
			housingGuestsAnnouncements.length = 0;

			for (
				let i = 0;
				i < window.data["announcementElements"].length;
				i++
			) {
				let guestsNumber = announcementObjects[i]["offer"]["guests"];

				if (
					!housingGuestsFilter.selectedIndex ||
					+housingGuestsFilter.value === guestsNumber
				) {
					housingGuestsAnnouncements.push(
						window.data["announcementElements"][i]
					);
				}
			}

			concat();
		});

		const announcements = window.data["announcementElements"];
		let featuresAnnouncements = announcements.slice();
		let currentCheckboxes = new Set();

		featuresCheckboxes.forEach(fc => {
			fc.addEventListener("change", function() {
				let isMatched = fc.matches(":checked");

				if (isMatched) {
					featuresAnnouncements.length = 0;
					currentCheckboxes.add(fc.value);
				} else {
					currentCheckboxes.delete(fc.value);
				}

				let size = currentCheckboxes.size;
				announcements.forEach((a) => {
					let count = 0;
					let features = Array.from(a.querySelector(".popup__features").children);

					for (let currentCheckbox of currentCheckboxes) {
						features.forEach((f) => {
							if (f.classList.contains(`feature--${currentCheckbox}`) && f.style.display !== "none") {
								count++;
							}
						});
					}
					
					if (count === size && (isMatched || !featuresAnnouncements.includes(a))) {
						featuresAnnouncements.push(a);
					}
				});

				concat();
			});
		});
	};

	const NUMBER_OF_ANNOUNCEMENTS = 5;
	const HOUSING_PRICE_MIN = 10000;
	const HOUSING_PRICE_MAX = 50000;
	let filterForm = document.querySelector(".map__filters");
	let housingTypeFilter = filterForm.housingtype;
	let housingPriceFilter = filterForm.housingprice;
	let housingRoomsFilter = filterForm.housingrooms;
	let housingGuestsFilter = filterForm.housingguests;
	let featuresCheckboxes = housingfeatures.querySelectorAll(
		'input[name="features"]'
	);
	let filteredAnnouncements = [];
	let filteredPins = [];
	let announcementObjects = [];
	let actualAnnouncements = [];

	function successLoadCallback(response) {
		announcementObjects = response;
		window.data["createPinElements"](announcementObjects);
		window.data["createAnnouncementElements"](announcementObjects);

		for (let i = 0; i < NUMBER_OF_ANNOUNCEMENTS; i++) {
			let announcementNumber = Math.floor(
				Math.random() * window.data["announcementElements"].length
			);

			if (
				!actualAnnouncements.includes(
					window.data["announcementElements"][announcementNumber]
				)
			) {
				actualAnnouncements.push(
					window.data["announcementElements"][announcementNumber]
				);
				window.render["actualPins"].push(
					window.data["pinElements"][announcementNumber]
				);
			} else {
				i--;
			}
		}

		window.render["render"](
			actualAnnouncements,
			window.render["actualPins"]
		);

		window.filter();
	}

	function failLoadCallback(errorMessage) {
		notification.classList.remove("hidden");
		notification.textContent = errorMessage;
		notification.style.color = "red";
		setTimeout(() => notification.classList.add("hidden"), TIMEOUT);
	}

	window.backend["load"](successLoadCallback, failLoadCallback);
})();
