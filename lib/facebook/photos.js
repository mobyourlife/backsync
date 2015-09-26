module.exports = (FB, id) => {
	var promise = new Promise((resolve, reject) => {
		FB.api(`/v2.4/${id}/photos`, (res) => {
			if (!res) {
				reject(new Error('Invalid response from Facebook!'));
			} else if (res.error) {
				reject(new Error(`Request error! ${res.error}`));
			} else {
				resolve(res);
			}
		});
	});

	return promise;
};
