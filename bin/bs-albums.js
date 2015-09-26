#!/usr/bin/env node

var program = require('commander'),
	auth = require('../lib/facebook/auth'),
	albums = require('../lib/facebook/albums');

program
	.parse(process.argv);

var args = {
	id: process.argv[2]
}

console.log(`Getting albums from user ${args.id}...`);

auth()
	.then((FB) => albums(FB, args.id), console.error)
	.then((albums) => console.log(albums), console.error);
