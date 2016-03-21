#!/usr/bin/env node

const program = require('commander')
const Facebook = require('../lib/facebook')

program
  .parse(process.argv)

var args = {
  id: process.argv[2]
}

console.log(`Getting info about user ${args.id}...`)

var fb = new Facebook()

fb.auth()
.then(() => fb.singleRequest(fb.about(args.id)))
.then((info) => console.log(info), console.error)
