var Q = require('q'),
	FB = require('fb');

module.exports = function () {
	var deferred = Q.defer();

	FB.api('oauth/access_token', {
		client_id: process.env.FACEBOOK_CLIENT_ID,
		client_secret: process.env.FACEBOOK_CLIENT_SECRET,
		grant_type: 'client_credentials'
	}, function (res) {
		if (!res) {
			deferred.reject(new Error('Invalid response from Facebook auth!'));
		} else if (res.error) {
			deferred.reject(new Error(`Authorisation error from Facebook auth! ${res.error}`));
		} else {
			FB.setAccessToken(res.access_token);
			deferred.resolve(FB);
		}
	});

	return deferred.promise;
};
