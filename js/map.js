("use strict");

(function() {
	const ORIGINAL_PIN_SPIKE_HEIGHT = 22;
	let map = document.querySelector(".map");
	let topMapBorder = 130;
	let bottomMapBorder = 630;
	let address = window.form["form"].querySelector("#address");
	let mapCoords = map.getBoundingClientRect();

	function originalPinMousedownHandler(downEvt) {
		downEvt.preventDefault();
		let startCoords = {
			x: downEvt.clientX,
			y: downEvt.clientY
		};
		let relativeShift = {
			x: Math.round(
				startCoords["x"] -
					window.form["originalPin"].getBoundingClientRect().x
			),
			y: Math.round(
				startCoords["y"] -
					window.form["originalPin"].getBoundingClientRect().y
			)
		};

		function originalPinMousemoveHandler(moveEvt) {
			moveEvt.preventDefault();
			let shift = {
				x: startCoords["x"] - moveEvt.clientX,
				y: startCoords["y"] - moveEvt.clientY
			};
			startCoords = {
				x: moveEvt.clientX,
				y: moveEvt.clientY
			};

			window.form["setAddressValue"](
				Math.round(
					window.form["originalPin"].getBoundingClientRect().x +
						pageXOffset +
						window.form["originalPin"].offsetWidth / 2 -
						mapCoords.left
				),
				Math.round(
					window.form["originalPin"].getBoundingClientRect().y +
						window.form["originalPin"].offsetHeight +
						pageYOffset +
						ORIGINAL_PIN_SPIKE_HEIGHT
				)
			);
			map.classList.remove("map--faded");

			Array.from(window.form["formFieldsets"]).forEach(
				fieldset => (fieldset.disabled = false)
			);

			address.disabled = true;
			window.render["actualPins"].forEach(actualPin =>
				actualPin.classList.remove("hidden")
			);

			window.form["form"].classList.remove("notice__form--disabled");

			if (startCoords["x"] - relativeShift["x"] < mapCoords.left) {
				window.form["originalPin"].style.left =
					window.form["originalPin"].offsetWidth / 2 + "px";
			} else if (
				startCoords["x"] -
					relativeShift["x"] +
					window.form["originalPin"].offsetWidth >
				mapCoords.right
			) {
				window.form["originalPin"].style.left =
					map.offsetWidth -
					window.form["originalPin"].offsetWidth / 2 +
					"px";
			} else {
				window.form["originalPin"].style.left =
					window.form["originalPin"].offsetLeft - shift["x"] + "px";
			}

			if (startCoords["y"] < topMapBorder) {
				window.form["originalPin"].style.top = topMapBorder + "px";
			} else if (
				startCoords["y"] -
					relativeShift["y"] +
					window.form["originalPin"].offsetHeight +
					ORIGINAL_PIN_SPIKE_HEIGHT >
				bottomMapBorder
			) {
				window.form["originalPin"].style.top =
					bottomMapBorder -
					window.form["originalPin"].offsetHeight -
					ORIGINAL_PIN_SPIKE_HEIGHT +
					"px";
			} else {
				window.form["originalPin"].style.top =
					window.form["originalPin"].offsetTop - shift["y"] + "px";
			}
		}

		function originalPinMouseupHandler(upEvt) {
			upEvt.preventDefault();
			document.removeEventListener(
				"mousemove",
				originalPinMousemoveHandler
			);
			document.removeEventListener("mouseup", originalPinMouseupHandler);
		}

		document.addEventListener("mousemove", originalPinMousemoveHandler);
		document.addEventListener("mouseup", originalPinMouseupHandler);
	}

	window.form["originalPin"].addEventListener(
		"mousedown",
		originalPinMousedownHandler
	);
})();
