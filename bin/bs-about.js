#!/usr/bin/env node

var program = require('commander'),
	auth = require('../lib/facebook/auth'),
	about = require('../lib/facebook/about');

program
	.parse(process.argv);

var args = {
	id: process.argv[2]
}

console.log(`Getting info about user ${args.id}...`);

auth()
	.then((FB) => about(FB, args.id), console.error)
	.then((user) => console.log(user), console.error);
