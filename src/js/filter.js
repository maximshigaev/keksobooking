import data from "./data.js";
import debounce from "./debounce.js";
import render from "./render.js";
import backend from "./backend.js";

function filter() {
	function concat() {
		const startAnnouncements = document.querySelectorAll(`.map__card`);
		const startPins = document.querySelectorAll(`.map__pin`);

		filteredAnnouncements.length = 0;
		filteredPins.length = 0;
		for (let i = 0; i < data[`announcementElements`].length; i++) {
			if (
				housingTypeAnnouncements.includes(
					data[`announcementElements`][i]
				) &&
				housingPriceAnnouncements.includes(
					data[`announcementElements`][i]
				) &&
				housingRoomsAnnouncements.includes(
					data[`announcementElements`][i]
				) &&
				housingGuestsAnnouncements.includes(
					data[`announcementElements`][i]
				) &&
				featuresAnnouncements.includes(data[`announcementElements`][i])
			) {
				filteredAnnouncements.push(data[`announcementElements`][i]);
				filteredPins.push(data[`pinElements`][i]);
			}
		}

		for (let i = 1; i < startPins.length; i++) {
			startPins[i].remove();
		}

		startAnnouncements.forEach((startAnnouncement) =>
			startAnnouncement.remove()
		);

		filteredPins.forEach((filteredPin) => {
			filteredPin.classList.remove(`hidden`);
		});

		if (filteredAnnouncements.length > NUMBER_OF_ANNOUNCEMENTS) {
			const filteredLongAnnouncements = [];
			const filteredLongPins = [];

			for (let i = 0; i < NUMBER_OF_ANNOUNCEMENTS; i++) {
				const index = Math.floor(
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
			debounce(
				render[`render`],
				filteredLongAnnouncements,
				filteredLongPins
			)();
		} else {
			debounce(render[`render`], filteredAnnouncements, filteredPins)();
		}
	}

	const housingTypeAnnouncements = data[`announcementElements`].slice();

	housingTypeFilter.addEventListener(`change`, function () {
		housingTypeAnnouncements.length = 0;

		for (let i = 0; i < data[`announcementElements`].length; i++) {
			const housingType = data[`announcementElements`][i].querySelector(
				`.popup__type`
			).textContent;
			const selectedType =
				housingTypeFilter.children[housingTypeFilter.selectedIndex]
					.textContent;
			if (
				!housingTypeFilter.selectedIndex ||
				housingType === selectedType
			) {
				housingTypeAnnouncements.push(data[`announcementElements`][i]);
			}
		}

		concat();
	});

	const housingPriceAnnouncements = data[`announcementElements`].slice();

	housingPriceFilter.addEventListener(`change`, function () {
		housingPriceAnnouncements.length = 0;

		for (let i = 0; i < data[`announcementElements`].length; i++) {
			const price = parseInt(
				data[`announcementElements`][i].querySelector(`.popup__price`)
					.textContent,
				10
			);

			switch (housingPriceFilter.selectedIndex) {
			case 0:
				housingPriceAnnouncements.push(
					data[`announcementElements`][i]
				);
				break;
			case 1:
				if (
					price >= HOUSING_PRICE_MIN &&
						price <= HOUSING_PRICE_MAX
				) {
					housingPriceAnnouncements.push(
						data[`announcementElements`][i]
					);
				}
				break;
			case 2:
				if (price < HOUSING_PRICE_MIN) {
					housingPriceAnnouncements.push(
						data[`announcementElements`][i]
					);
				}
				break;
			case 3:
				if (price > HOUSING_PRICE_MAX) {
					housingPriceAnnouncements.push(
						data[`announcementElements`][i]
					);
				}
				break;
			}
		}

		concat();
	});

	const housingRoomsAnnouncements = data[`announcementElements`].slice();

	housingRoomsFilter.addEventListener(`change`, function () {
		housingRoomsAnnouncements.length = 0;

		for (let i = 0; i < data[`announcementElements`].length; i++) {
			const roomsNumber = announcementObjects[i][`offer`][`rooms`];

			if (
				!housingRoomsFilter.selectedIndex ||
				+housingRoomsFilter.value === roomsNumber
			) {
				housingRoomsAnnouncements.push(data[`announcementElements`][i]);
			}
		}

		concat();
	});

	const housingGuestsAnnouncements = data[`announcementElements`].slice();

	housingGuestsFilter.addEventListener(`change`, function () {
		housingGuestsAnnouncements.length = 0;

		for (let i = 0; i < data[`announcementElements`].length; i++) {
			const guestsNumber = announcementObjects[i][`offer`][`guests`];

			if (
				!housingGuestsFilter.selectedIndex ||
				+housingGuestsFilter.value === guestsNumber
			) {
				housingGuestsAnnouncements.push(
					data[`announcementElements`][i]
				);
			}
		}

		concat();
	});

	const announcements = data[`announcementElements`];
	const featuresAnnouncements = announcements.slice();
	const currentCheckboxes = new Set();

	featuresCheckboxes.forEach((fc) => {
		fc.addEventListener(`change`, function () {
			const isMatched = fc.matches(`:checked`);

			if (isMatched) {
				featuresAnnouncements.length = 0;
				currentCheckboxes.add(fc.value);
			} else {
				currentCheckboxes.delete(fc.value);
			}

			const size = currentCheckboxes.size;
			announcements.forEach((a) => {
				let count = 0;
				const features = Array.from(
					a.querySelector(`.popup__features`).children
				);

				for (let currentCheckbox of currentCheckboxes) {
					features.forEach((f) => {
						if (
							f.classList.contains(
								`feature--${currentCheckbox}`
							) &&
							f.style.display !== `none`
						) {
							count++;
						}
					});
				}

				if (
					count === size &&
					(isMatched || !featuresAnnouncements.includes(a))
				) {
					featuresAnnouncements.push(a);
				}
			});

			concat();
		});
	});
}

const NUMBER_OF_ANNOUNCEMENTS = 5;
const HOUSING_PRICE_MIN = 10000;
const HOUSING_PRICE_MAX = 50000;
const TIMEOUT = 2000;
const filterForm = document.querySelector(`.map__filters`);
const notification = document.querySelector(`.notification`);
const housingTypeFilter = filterForm.housingtype;
const housingPriceFilter = filterForm.housingprice;
const housingRoomsFilter = filterForm.housingrooms;
const housingGuestsFilter = filterForm.housingguests;
const featuresCheckboxes = housingfeatures.querySelectorAll(
	`input[name="features"]`
);
const filteredAnnouncements = [];
const filteredPins = [];
let announcementObjects = [];
const actualAnnouncements = [];

function successLoadCallback(response) {
	announcementObjects = response;
	data[`createPinElements`](announcementObjects);
	data[`createAnnouncementElements`](announcementObjects);

	for (let i = 0; i < NUMBER_OF_ANNOUNCEMENTS; i++) {
		const announcementNumber = Math.floor(
			Math.random() * data[`announcementElements`].length
		);

		if (
			!actualAnnouncements.includes(
				data[`announcementElements`][announcementNumber]
			)
		) {
			actualAnnouncements.push(
				data[`announcementElements`][announcementNumber]
			);
			render[`actualPins`].push(data[`pinElements`][announcementNumber]);
		} else {
			i--;
		}
	}

	render[`render`](actualAnnouncements, render[`actualPins`]);

	filter();
}

function failLoadCallback(errorMessage) {
	notification.classList.remove(`hidden`);
	notification.textContent = errorMessage;
	notification.style.color = `red`;
	setTimeout(() => notification.classList.add(`hidden`), TIMEOUT);
}

backend[`load`](successLoadCallback, failLoadCallback);

export default filter;
