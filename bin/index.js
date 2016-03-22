'use strict'

// Load settings
const info = require('../package')

// Load modules
const redis = require('redis')
const bunyan = require('bunyan')
const channels = require('../channels')
const Facebook = require('../lib/facebook')

// Initialise logging
const log = bunyan.createLogger({
  name: info.name
})

// Initialise Redis client
var client = redis.createClient()

// Setup client handlers
client.on('error', handleErrors)
client.on('message', listenMessages)

// Subscribe to the pubsub channels
var keys = Object.keys(channels)
for (var i of keys) {
  let ch = channels[i]
  log.info(`Listening to channel ${ch.channelName}`)
  client.subscribe(ch.channelName)
}

/**
 * Handle client errors.
 * @param  {String} err Error message.
 */
function handleErrors (err) {
  log.error(err)
}

/**
 * Listen to published messages.
 * @param  {String} channelName Channel the message was delivered to.
 * @param  {String} messageBody Message body.
 */
function listenMessages (channelName, messageBody) {
  let ch = channels[channelName]

  if (ch) {
    let data = tryParseJson(messageBody) || messageBody

    try {
      ch.executeMessage(data)
    } catch (e) {
      log.error(`Error from channel "${channelName}": ${e.message}! Received message: "${messageBody}".`)
    }
  } else {
    log.warn(`Invalid channel "${channelName}"! Received message: "${messageBody}".`)
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
