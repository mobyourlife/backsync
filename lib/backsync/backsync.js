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
  var self = this

  this.queue = []
  this.running = true
  this.dequeuedAt = Date.now()

  /**
   * Start service loop.
   */
  this.start = () => {
    loop()
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
    if (self.running) {
      setTimeout(loop, LOOP_INTERVAL)
    }
  }

  /**
   * Check if it should dequeue objects.
   * @return {Boolean} Whether it should queue objects.
   */
  function shouldDequeue () {
    // Reached dequeue length
    if (self.queue.length >= DEQUEUE_LENGTH) {
      return true
    } else {
      let diff = (Date.now() - self.dequeuedAt)

      // Reached dequeue timeout
      if (diff >= DEQUEUE_TIMEOUT) {
        self.dequeuedAt = Date.now()
        return true
      }
    }

    // Shouldn't dequeue yet
    return false
  }
}
