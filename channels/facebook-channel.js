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
  this.queue = []

  this.executeMessage = syncObject.bind(this)
}

/**
 * Synchronise objects.
 * @param  {Object} data Reference of the object to be synchronised.
 */
function syncObject (data) {
  if (!data) throw new Error('Data cannot be null!')
  if (typeof data !== 'object') throw new Error('Data must be an object')
  if (!data.object_id) throw new Error('Must supply object_id!')
  if (!data.type) throw new Error('Must supply type!')
}
