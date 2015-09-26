#!/usr/bin/env node

var program = require('commander'),
	auth = require('../lib/facebook/auth'),
	photos = require('../lib/facebook/photos');

program
	.parse(process.argv);

var args = {
	id: process.argv[2]
}

console.log(`Getting photos from album ${args.id}...`);

auth()
	.then((FB) => photos(FB, args.id), console.error)
	.then((photos) => console.log(photos), console.error);
