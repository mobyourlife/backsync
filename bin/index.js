'use strict'

// Set constants
const CHANNEL_NAME = 'mob-backsync'

// Load modules
const redis = require('redis')
const Facebook = require('../lib/facebook')

// Initialise Redis client
var client = redis.createClient()

client.on('error', (err) => {
  console.log('Error:', err)
})

// Listen to published messages
client.on('message', (channel, message) => {
  try {
    let data = JSON.parse(message)
    console.log('Channel: ' + channel, ', Data:', data)
  } catch (e) {
    console.log('Channel: ' + channel, ', Message:', message)
  }
})

// Subscribe to the pubsub channel
client.subscribe(CHANNEL_NAME)
