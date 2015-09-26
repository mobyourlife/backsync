module.exports = (id) => {
	return {
		version: '2.4',
		method: 'GET',
		endpoint: `${id}/albums`,
		fields: []
	};
};
