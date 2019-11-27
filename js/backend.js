"use strict";

(function() {
	window.backend = {
		load: function(onLoad, onError) {
			let xhr = new XMLHttpRequest();
			xhr.responseType = "json";
			xhr.open("GET", GETURL);
			xhr.addEventListener("load", function() {
				if (xhr.status === SUCCESS_STATUS) {
					onLoad(xhr.response);
				} else {
					onError(`Ошибка ${xhr.status}`);
				}
			});
			xhr.addEventListener("error", function() {
				onError("Произошла ошибка загрузки данных");
			});
			xhr.send();
		},
		dispatch: function(data, onLoad, onError) {
			let xhr = new XMLHttpRequest();
			xhr.responseType = "json";
			xhr.open("POST", POSTURL);
			xhr.addEventListener("load", function() {
				if (xhr.status === SUCCESS_STATUS) {
					onLoad();
				} else {
					onError(`Ошибка ${xhr.status}`);
				}
			});
			xhr.addEventListener("error", function() {
				onError("Произошла ошибка отправки формы");
			});
			xhr.send(data);
		}
	};
	const GETURL = "https://js.dump.academy/keksobooking/data";
	const POSTURL = "https://js.dump.academy/keksobooking";
	const SUCCESS_STATUS = 200;
})();
