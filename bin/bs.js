#!/usr/bin/env node

var program = require('commander');
var package = require('../package');

program
    .version(package.version)
    .command('info [id]', 'get info from fanpage [id]')
    .parse(process.argv);
