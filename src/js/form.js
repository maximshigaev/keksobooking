import data from "./data.js";
import backend from "./backend.js";

const form = {
	form: document.querySelector(`.notice__form`),
	formFieldsets: document.querySelector(`.notice__form`).children,
	addressInput: document.querySelector(`#address`),
	setAddressValue(x, y) {
		form[`addressInput`].value = x + `, ` + y;
	},
	originalPin: document.querySelector(`.map__pin--main`)
};

const ORIGINAL_PIN_SPIKE_HEIGHT = 22;
const TIMEOUT = 2000;
const priceMap = {
	flat: 1000,
	bungalo: 0,
	house: 5000,
	palace: 10000
};
const initialPinCoords = {
	x: Math.round(
		form[`originalPin`].getBoundingClientRect().x +
			pageXOffset +
			form[`originalPin`].offsetWidth / 2 -
			document.querySelector(`.map`).getBoundingClientRect().left
	),
	y: Math.round(
		form[`originalPin`].getBoundingClientRect().y +
			form[`originalPin`].offsetHeight +
			pageYOffset +
			ORIGINAL_PIN_SPIKE_HEIGHT
	)
};
const inputs = form[`form`].querySelectorAll(`input`);
const checkin = form[`form`].querySelector(`#timein`);
const checkout = form[`form`].querySelector(`#timeout`);
const textArea = form[`form`].description;
const checkboxes = form[`form`].features;
const roomNumber = form[`form`].querySelector(`#room_number`);
const guestNumber = form[`form`].querySelector(`#capacity`);
const selects = form[`form`].querySelectorAll(`select`);
const housingType = form[`form`].querySelector(`#type`);
const resetButton = form[`form`].querySelector(`.form__reset`);
const nightPrice = form[`form`].querySelector(`#price`);
const notification = document.querySelector(`.notification`);

form[`setAddressValue`](initialPinCoords[`x`], initialPinCoords[`y`]);
Array.from(form[`formFieldsets`]).forEach(
	(fieldset) => (fieldset.disabled = true)
);

function resetForm() {
	const avatar = form[`form`].querySelector(`.notice__preview`)
		.firstElementChild;
	const images = form[`form`]
		.querySelector(`.form__photo-container`)
		.querySelectorAll(`img`);

	avatar.src = `img/muffin.png`;
	images.forEach((image) => image.remove());

	document.querySelector(`.map`).classList.add(`map--faded`);

	Array.from(form[`formFieldsets`]).forEach(
		(fieldset) => (fieldset.disabled = true)
	);
	inputs.forEach((input) => (input.value = ``));

	checkboxes.forEach((checkbox) => (checkbox.checked = false));

	selects.forEach((select) => {
		const defaultSelectedOption = select.querySelector(`option[selected]`);
		select.value = defaultSelectedOption.value;
	});

	inputs.forEach((input) => {
		input.style.borderColor = ``;
		input.style.borderWidth = ``;
	});
	textArea.value = ``;

	form[`addressInput`].value =
		initialPinCoords[`x`] + `, ` + initialPinCoords[`y`];

	data[`pinElements`].forEach((pinElement) =>
		pinElement.classList.add(`hidden`)
	);
	form[`form`].classList.add(`notice__form--disabled`);

	form[`originalPin`].style.left =
		initialPinCoords[`x`] - form[`originalPin`].offsetWidth / 2 + `px`;

	form[`originalPin`].style.top =
		initialPinCoords[`y`] -
		form[`originalPin`].offsetHeight -
		ORIGINAL_PIN_SPIKE_HEIGHT +
		`px`;
}

form[`form`].addEventListener(
	`invalid`,
	function (evt) {
		evt.target.style.borderColor = `red`;
		evt.target.style.borderWidth = `5px`;
	},
	true
);

roomNumber.addEventListener(`change`, function () {
	Array.from(guestNumber.options).forEach((option) => (option.disabled = true));
	switch (roomNumber.selectedIndex) {
	case 0:
		guestNumber.options[2].disabled = false;
		guestNumber.selectedIndex = 2;
		break;
	case 1:
		guestNumber.options[1].disabled = false;
		guestNumber.options[2].disabled = false;
		guestNumber.selectedIndex = 1;
		break;
	case 2:
		Array.from(guestNumber.options).forEach(
			(option) => (option.disabled = false)
		);
		guestNumber.options[3].disabled = true;
		guestNumber.selectedIndex = 0;
		break;
	case 3:
		guestNumber.options[3].disabled = false;
		guestNumber.selectedIndex = 3;
		break;
	}
});

resetButton.addEventListener(`click`, resetForm);

checkin.addEventListener(`change`, function () {
	checkout.selectedIndex = checkin.selectedIndex;
});

checkout.addEventListener(`change`, function () {
	checkin.selectedIndex = checkout.selectedIndex;
});

housingType.addEventListener(`change`, function () {
	nightPrice.min = priceMap[housingType.value];
	nightPrice.placeholder = priceMap[housingType.value];
});

form[`form`].addEventListener(`submit`, function (evt) {
	evt.preventDefault();
	backend.dispatch(
		new FormData(form[`form`]),
		successDispatchCallback,
		failDispatchCallback
	);
});

function successDispatchCallback() {
	resetForm();
	notification.classList.remove(`hidden`);
	notification.textContent = `Данные успешно сохранены`;
	notification.style.color = `black`;

	window.addEventListener(`keydown`, successKeydownHandler);
	window.addEventListener(`click`, successClickHandler);

	function successKeydownHandler(evt) {
		if (evt.code === `Escape`) {
			notification.classList.add(`hidden`);
			window.removeEventListener(`keydown`, successKeydownHandler);
			window.removeEventListener(`click`, successClickHandler);
		}
	}

	function successClickHandler() {
		notification.classList.add(`hidden`);
		window.removeEventListener(`click`, successClickHandler);
		window.removeEventListener(`keydown`, successKeydownHandler);
	}
}

function failDispatchCallback(errorMessage) {
	notification.classList.remove(`hidden`);
	notification.textContent = errorMessage;
	notification.style.color = `red`;
	setTimeout(() => notification.classList.add(`hidden`), TIMEOUT);
}

export default form;
