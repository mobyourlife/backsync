'use strict'

// Set constants
const CHANNEL_NAME = 'mob-backsync'

// Load modules
const redis = require('redis')
const Facebook = require('../lib/facebook')

// Initialise Redis client
var client = redis.createClient()

// Setup client handlers
client.on('error', handleErrors)
client.on('message', listenMessages)

// Subscribe to the pubsub channel
client.subscribe(CHANNEL_NAME)

/**
 * Handle client errors.
 * @param  {String} err Error message.
 */
function handleErrors (err) {
  console.error('Error:', err)
}

/**
 * Listen to published messages.
 * @param  {String} channel Channel the message was delivered to.
 * @param  {String} message Message body.
 */
function listenMessages (channel, message) {
  let data = tryParseJson(message)

  if (data) {
    console.log('Channel: ' + channel, ', Data:', data)
  } else {
    console.log('Channel: ' + channel, ', Message:', message)
  }
}

/**
 * Try to parse a given string to an objected.
 * @param  {String} str String to be parsed.
 * @return {Object}     JSON object, if valid, otherwise false.
 */
function tryParseJson (str) {
  try {
    let data = JSON.parse(str)

    if (data && typeof data === 'object' && data !== null) {
      return data;
    }
  } catch (e) { }

  return false
}
