#!/usr/bin/env node

var program = require('commander'),
	auth = require('../plugins/facebook/auth'),
	request = require('../plugins/facebook/request/single'),
	about = require('../plugins/facebook/data/about');

program
	.parse(process.argv);

var args = {
	id: process.argv[2]
}

console.log(`Getting info about user ${args.id}...`);

auth()
	.then((FB) => request(FB, about(args.id)), console.error)
	.then((user) => console.log(user), console.error);
