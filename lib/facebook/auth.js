var FB = require('fb');

module.exports = function () {
	var promise = new Promise((resolve, reject) => {
		FB.api('oauth/access_token', {
			client_id: process.env.FACEBOOK_CLIENT_ID,
			client_secret: process.env.FACEBOOK_CLIENT_SECRET,
			grant_type: 'client_credentials'
		}, (res) => {
			if (!res) {
				reject(new Error('Invalid response from Facebook auth!'));
			} else if (res.error) {
				reject(new Error(`Authorisation error from Facebook auth! ${res.error}`));
			} else {
				FB.setAccessToken(res.access_token);
				resolve(FB);
			}
		});
	});

	return promise;
};
