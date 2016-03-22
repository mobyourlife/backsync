'use strict'

// Load modules
const fs = require('fs')

// Load all channels to a list
var channelsList = []

fs.readdirSync(__dirname).forEach((file) => {
  if (file.match(/-channel\.js$/)) {
    let module = require('./' + file)
    let instance = new module()
    channelsList[instance.channelName] = instance
  }
})

// Exports the channel list
module.exports = channelsList
