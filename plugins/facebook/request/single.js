'use strict';

module.exports = (FB, options) => {
	let endpoint = `/v${options.version}/${options.endpoint}`;
	console.log(`Endpoint: ${endpoint}`);

	var promise = new Promise((resolve, reject) => {
		FB.api(endpoint, (res) => {
			if (!res) {
				reject(new Error('Invalid response from Facebook!'));
			} else if (res.error) {
				console.error(res.error);
				reject(new Error(`Request error! ${res.error}`));
			} else {
				resolve(res);
			}
		});
	});

	return promise;
}
