import form from "./form.js";
import render from "./render.js";

function mainMap() {
	const ORIGINAL_PIN_SPIKE_HEIGHT = 22;
	const map = document.querySelector(`.map`);
	const TOP_MAP_BORDER = 130;
	const BOTTOM_MAP_BORDER = 630;
	const address = form[`form`].querySelector(`#address`);
	const mapCoords = map.getBoundingClientRect();

	function Coordinates(coordX, coordY) {
		(this.x = coordX), (this.y = coordY);
	}

	function originalPinMousedownHandler(downEvt) {
		downEvt.preventDefault();
		let startCoords = new Coordinates(downEvt.clientX, downEvt.clientY);
		const relativeShift = new Coordinates(
			Math.round(
				startCoords[`x`] - form[`originalPin`].getBoundingClientRect().x
			),
			Math.round(
				startCoords[`y`] - form[`originalPin`].getBoundingClientRect().y
			)
		);

		function originalPinMousemoveHandler(moveEvt) {
			moveEvt.preventDefault();
			const shift = new Coordinates(
				startCoords[`x`] - moveEvt.clientX,
				startCoords[`y`] - moveEvt.clientY
			);
			startCoords = {
				x: moveEvt.clientX,
				y: moveEvt.clientY
			};

			form[`setAddressValue`](
				Math.round(
					form[`originalPin`].getBoundingClientRect().x +
						pageXOffset +
						form[`originalPin`].offsetWidth / 2 -
						mapCoords.left
				),
				Math.round(
					form[`originalPin`].getBoundingClientRect().y +
						form[`originalPin`].offsetHeight +
						pageYOffset +
						ORIGINAL_PIN_SPIKE_HEIGHT
				)
			);
			map.classList.remove(`map--faded`);

			Array.from(form[`formFieldsets`]).forEach(
				(fieldset) => (fieldset.disabled = false)
			);

			address.disabled = true;
			render[`actualPins`].forEach((actualPin) =>
				actualPin.classList.remove(`hidden`)
			);

			form[`form`].classList.remove(`notice__form--disabled`);

			if (startCoords[`x`] - relativeShift[`x`] < mapCoords.left) {
				form[`originalPin`].style.left =
					form[`originalPin`].offsetWidth / 2 + `px`;
			} else if (
				startCoords[`x`] -
					relativeShift[`x`] +
					form[`originalPin`].offsetWidth >
				mapCoords.right
			) {
				form[`originalPin`].style.left =
					map.offsetWidth -
					form[`originalPin`].offsetWidth / 2 +
					`px`;
			} else {
				form[`originalPin`].style.left =
					form[`originalPin`].offsetLeft - shift[`x`] + `px`;
			}

			if (startCoords[`y`] < TOP_MAP_BORDER) {
				form[`originalPin`].style.top = TOP_MAP_BORDER + `px`;
			} else if (
				startCoords[`y`] -
					relativeShift[`y`] +
					form[`originalPin`].offsetHeight +
					ORIGINAL_PIN_SPIKE_HEIGHT >
				BOTTOM_MAP_BORDER
			) {
				form[`originalPin`].style.top =
					BOTTOM_MAP_BORDER -
					form[`originalPin`].offsetHeight -
					ORIGINAL_PIN_SPIKE_HEIGHT +
					`px`;
			} else {
				form[`originalPin`].style.top =
					form[`originalPin`].offsetTop - shift[`y`] + `px`;
			}
		}

		function originalPinMouseupHandler(upEvt) {
			upEvt.preventDefault();
			document.removeEventListener(
				`mousemove`,
				originalPinMousemoveHandler
			);
			document.removeEventListener(`mouseup`, originalPinMouseupHandler);
		}

		document.addEventListener(`mousemove`, originalPinMousemoveHandler);
		document.addEventListener(`mouseup`, originalPinMouseupHandler);
	}

	form[`originalPin`].addEventListener(
		`mousedown`,
		originalPinMousedownHandler
	);
}

export default mainMap;
