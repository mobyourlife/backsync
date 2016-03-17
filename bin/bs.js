#!/usr/bin/env node

'use strict'

const program = require('commander')
const info = require('../package')

program
  .version(info.version)
  .command('about [id]', 'get info about user [id]')
  .command('albums [id]', 'get albums from user [id')
  .command('photos [id]', 'get photos from album [id]')
  .parse(process.argv)
