#!/usr/bin/env node

var program = require('commander'),
	auth = require('../plugins/facebook/auth'),
	request = require('../plugins/facebook/request/single'),
	photos = require('../plugins/facebook/data/photos');

program
	.parse(process.argv);

var args = {
	id: process.argv[2]
}

console.log(`Getting photos from album ${args.id}...`);

auth()
	.then((FB) => request(FB, photos(args.id)), console.error)
	.then((photos) => console.log(photos), console.error);
