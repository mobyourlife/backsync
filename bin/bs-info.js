#!/usr/bin/env node

var program = require('commander');

program
	.parse(process.argv);

var args = {
	id: process.argv[2]
}

console.log(`You want info about ${args.id}!`);
