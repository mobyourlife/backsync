#!/usr/bin/env node

const program = require('commander')
const auth = require('../plugins/facebook/auth')
const request = require('../plugins/facebook/request/single')
const albums = require('../plugins/facebook/data/albums')

program
  .parse(process.argv)

var args = {
  id: process.argv[2]
}

console.log(`Getting albums from user ${args.id}...`)

auth()
  .then((FB) => request(FB, albums(args.id)), console.error)
  .then((albums) => console.log(albums), console.error)
