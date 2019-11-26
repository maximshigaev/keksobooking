("use strict");

(function() {
	window.form = {
		form: document.querySelector(".notice__form"),
		formFieldsets: document.querySelector(".notice__form").children,
		addressInput: document.querySelector("#address"),
		setAddressValue: function(x, y) {
			window.form["addressInput"].value = x + ", " + y;
		},
		originalPin: document.querySelector(".map__pin--main")
	};

	const ORIGINAL_PIN_SPIKE_HEIGHT = 22;
	const TIMEOUT = 2000;
	let priceMap = {
		flat: 1000,
		bungalo: 0,
		house: 5000,
		palace: 10000
	};
	let initialPinCoords = {
		x: Math.round(
			window.form["originalPin"].getBoundingClientRect().x +
				pageXOffset +
				window.form["originalPin"].offsetWidth / 2 -
				document.querySelector(".map").getBoundingClientRect().left
		),
		y: Math.round(
			window.form["originalPin"].getBoundingClientRect().y +
				window.form["originalPin"].offsetHeight +
				pageYOffset +
				ORIGINAL_PIN_SPIKE_HEIGHT
		)
	};
	let inputs = window.form["form"].querySelectorAll("input");
	let checkin = window.form["form"].querySelector("#timein");
	let checkout = window.form["form"].querySelector("#timeout");
	let textArea = window.form["form"].description;
	let checkboxes = window.form["form"].features;
	let roomNumber = window.form["form"].querySelector("#room_number");
	let guestNumber = window.form["form"].querySelector("#capacity");
	let selects = window.form["form"].querySelectorAll("select");
	let housingType = window.form["form"].querySelector("#type");
	let resetButton = window.form["form"].querySelector(".form__reset");
	let nightPrice = window.form["form"].querySelector("#price");
	let notification = document.querySelector(".notification");

	window.form["setAddressValue"](
		initialPinCoords["x"],
		initialPinCoords["y"]
	);
	Array.from(window.form["formFieldsets"]).forEach(
		fieldset => (fieldset.disabled = true)
	);

	function resetForm() {
		document.querySelector(".map").classList.add("map--faded");
		Array.from(window.form["formFieldsets"]).forEach(
			fieldset => (fieldset.disabled = true)
		);
		inputs.forEach(input => (input.value = ""));
		checkboxes.forEach(checkbox => (checkbox.checked = false));
		selects.forEach(select => {
			let defaultSelectedOption = select.querySelector(
				"option[selected]"
			);
			select.value = defaultSelectedOption.value;
		});

		inputs.forEach(input => {
			input.style.borderColor = "";
			input.style.borderWidth = "";
		});
		textArea.value = "";
		window.form["addressInput"].value =
			initialPinCoords["x"] + ", " + initialPinCoords["y"];
		window.data["pinElements"].forEach(pinElement =>
			pinElement.classList.add("hidden")
		);
		window.form["form"].classList.add("notice__form--disabled");
		window.form["originalPin"].style.left =
			initialPinCoords["x"] -
			window.form["originalPin"].offsetWidth / 2 +
			"px";
		window.form["originalPin"].style.top =
			initialPinCoords["y"] -
			window.form["originalPin"].offsetHeight -
			ORIGINAL_PIN_SPIKE_HEIGHT +
			"px";
	}

	window.form["form"].addEventListener(
		"invalid",
		function(evt) {
			evt.target.style.borderColor = "red";
			evt.target.style.borderWidth = "5px";
		},
		true
	);

	roomNumber.addEventListener("change", function() {
		Array.from(guestNumber.options).forEach(
			option => (option.disabled = true)
		);
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
					option => (option.disabled = false)
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

	resetButton.addEventListener("click", resetForm);

	checkin.addEventListener("change", function() {
		checkout.selectedIndex = checkin.selectedIndex;
	});

	checkout.addEventListener("change", function() {
		checkin.selectedIndex = checkout.selectedIndex;
	});

	housingType.addEventListener("change", function() {
		nightPrice.min = priceMap[housingType.value];
		nightPrice.placeholder = priceMap[housingType.value];
	});

	window.form["form"].addEventListener("submit", function(evt) {
		evt.preventDefault();
		window.backend.dispatch(
			new FormData(window.form["form"]),
			successDispatchCallback,
			failDispatchCallback
		);
	});

	function successDispatchCallback() {
		resetForm();
		notification.classList.remove("hidden");
		notification.textContent = "Данные успешно сохранены";
		notification.style.color = "black";

		window.addEventListener("keydown", successKeydownHandler);
		window.addEventListener("click", successClickHandler);

		function successKeydownHandler(evt) {
			if (evt.code === "Escape") {
				notification.classList.add("hidden");
				window.removeEventListener("keydown", successKeydownHandler);
				window.removeEventListener("click", successClickHandler);
			}
		}

		function successClickHandler() {
			notification.classList.add("hidden");
			window.removeEventListener("click", successClickHandler);
			window.removeEventListener("keydown", successKeydownHandler);
		}
	}

	function failDispatchCallback(errorMessage) {
		notification.classList.remove("hidden");
		notification.textContent = errorMessage;
		notification.style.color = "red";
		setTimeout(() => notification.classList.add("hidden"), TIMEOUT);
	}
})();
