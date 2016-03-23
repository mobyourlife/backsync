'use strict'

// Set constants
const LOOP_INTERVAL = 100 // loop every 100ms
const FB_API_GAUGE_TIME = 25 // wait time for each item from a batch request
const DEQUEUE_LENGTH = 50 // dequeue tasks when there are at least 50 objects to sync
const DEQUEUE_TIMEOUT = 5000 // dequeue tasks if no object has been added for 5s

// Default database connection
const defaultConnection = 'mongodb://localhost:27017/mobyourlife'

// Load modules
const mongoose = require('mongoose')
const Facebook = require('../facebook')

// Modules to save synced data
const saveAbout = require('./save/about')
const savePosts = require('./save/posts')
const saveAlbums = require('./save/albums')

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
    if (!data.siteId) throw new Error('Must supply siteId!')
    if (!data.objectId) throw new Error('Must supply objectId!')
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
    let diff = (Date.now() - dequeuedAt)

    // No object in the queue
    if (queue.length === 0) {
      return false
    }

    // Reached dequeue length
    if (queue.length >= DEQUEUE_LENGTH) {
      let wait = (queue.length * FB_API_GAUGE_TIME)
      if (diff >= wait) {
        return true
      }
    } else {
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
          saveAbout(item.siteId, item.objectId, item.response)
          break

        case 'posts':
          savePosts(item.siteId, item.objectId, item.response, self.enqueue)
          break

        case 'albums':
          saveAlbums(item.siteId, item.objectId, item.response, self.enqueue)
          break

        default:
          console.error('Unrecognised object type: ' + item.type)
          break
      }
    }
  }
}
