module.exports = () => {};

module.exports.request = (id) => {
	return {
		version: '2.4',
		method: 'GET',
		endpoint: `${id}`,
		fields: []
	};
};

module.exports.transform = (input) => {
	return {
		
	};
};
