'use strict'

// Set constants
const LOOP_INTERVAL = 100 // loop every 100ms
const DEQUEUE_LENGTH = 50 // dequeue tasks when there are at least 50 objects to sync
const DEQUEUE_TIMEOUT = 5000 // dequeue tasks if no object has been added for 5s

// Default database connection
const defaultConnection = 'mongodb://localhost:27017/mobyourlife'

// Load modules
const mongoose = require('mongoose')
const Facebook = require('../facebook')
const Site = require('mob-api/models/site')

// Exports module's entry point
module.exports = BackSync

/**
 * Synchronisation priority queue.
 */
function BackSync (connection) {
  const database = connection || process.env.DATABASE || defaultConnection

  let self = this
  let queue = []
  let running = false
  let dequeuedAt = Date.now()

  /**
   * Start service loop.
   */
  this.start = () => {
    mongoose.connect(database)
    running = true
    loop()
  }

  /**
   * Stop service loop.
   */
  this.stop = () => {
    mongoose.disconnect()
    running = false
  }

  /**
   * Enqueue a new object to be synchronised.
   * @param  {Object} data Object to be synchronised.
   */
  this.enqueue = (data) => {
    if (!data) throw new Error('Data cannot be null!')
    if (typeof data !== 'object') throw new Error('Data must be an object')
    if (!data.object_id) throw new Error('Must supply object_id!')
    if (!data.type) throw new Error('Must supply type!')

    data.queuedAt = Date.now()
    queue.push(data)
  }

  /**
   * Service loop.
   */
  function loop () {
    if (shouldDequeue()) {
      let fb = new Facebook()

      // Dequeue objects
      let count = Math.min(DEQUEUE_LENGTH, queue.length)
      let items = queue.splice(0, count)

      // Perform a batch request
      fb.auth()
      .then(() => fb.batchRequest(items))
      .then((res) => saveObjects(res), console.error)
    }

    // Keep looping
    if (running) {
      setTimeout(loop, LOOP_INTERVAL)
    }
  }

  /**
   * Check if it should dequeue objects.
   * @return {Boolean} Whether it should queue objects.
   */
  function shouldDequeue () {
    // No object in the queue
    if (queue.length === 0) {
      return false
    }

    // Reached dequeue length
    if (queue.length >= DEQUEUE_LENGTH) {
      return true
    } else {
      let diff = (Date.now() - dequeuedAt)

      // Reached dequeue timeout
      if (diff >= DEQUEUE_TIMEOUT) {
        dequeuedAt = Date.now()
        return true
      }
    }

    // Shouldn't dequeue yet
    return false
  }

  /**
   * Save the provided objects in the database.
   * @param  {Array} res Array of objects to be saved in the database.
   */
  function saveObjects (res) {
    for (var item of res) {
      switch (item.type) {
        case 'about':
          saveAbout(item.object_id, item.response)
          break

        default:
          break
      }
    }
  }

  /**
   * Save info about a fanpage.
   * @param  {Number} object_id ID of the fanpage to be updated.
   * @param  {Object} info      Info about the fanpage to be updated.
   */
  function saveAbout (object_id, info) {
    console.log('Saving about...')

    let query = { 'sources.facebook.fanpages._id': object_id }
    let data = {
      description: info.description || info.about,

      info: {
        location: {
          address: info.single_line_address,
          parking: info.parking
        },

        company: {
          founded: info.founded
        }
      }
    }

    console.log(query)
    console.log(data)

    Site.update(query, { $set: data }, (err, result) => {
      if (err) {
        throw new Error(err)
      } else {
        console.log(result)
      }
    })
  }
}
