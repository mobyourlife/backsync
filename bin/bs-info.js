#!/usr/bin/env node

var program = require('commander'),
	auth = require('../lib/facebook/auth');

program
	.parse(process.argv);

var args = {
	id: process.argv[2]
}

console.log(`You want info about ${args.id}!`);

auth()
	.then((FB) => {
		console.log('Authorisation successful!');
	}, (err) => {
		console.log(err);
	});
