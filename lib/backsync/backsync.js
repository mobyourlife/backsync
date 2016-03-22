'use strict'

// Set constants
const LOOP_INTERVAL = 100 // loop every 100ms
const DEQUEUE_LENGTH = 50 // dequeue tasks when there are at least 50 objects to sync
const DEQUEUE_TIMEOUT = 5000 // dequeue tasks if no object has been added for 5s

// Load modules


// Exports module's entry point
module.exports = BackSync

/**
 * Synchronisation priority queue.
 */
function BackSync () {
  let self = this
  let queue = []
  let running = false
  let dequeuedAt = Date.now()

  /**
   * Start service loop.
   */
  this.start = () => {
    running = true
    loop()
  }

  /**
   * Stop service loop.
   */
  this.stop = () => {
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
    // Dequeue objects
    if (shouldDequeue()) {
      //
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
}
