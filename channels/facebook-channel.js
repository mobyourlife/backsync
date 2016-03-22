'use strict'

// Load modules
const Facebook = require('../lib/facebook')
const fb = new Facebook()

// Exports module's entry point
module.exports = FacebookChannel

/**
 * Facebook integration channel.
 */
function FacebookChannel () {
  this.channelName = 'mob#facebook'
}
