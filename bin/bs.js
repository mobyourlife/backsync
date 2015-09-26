#!/usr/bin/env node

var program = require('commander');
var package = require('../package');

program
    .version(package.version)
    .command('about [id]', 'get info about user [id]')
    .command('albums [id]', 'get albums from user [id')
    .parse(process.argv);
