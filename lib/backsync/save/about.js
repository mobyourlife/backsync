'use strict'

// Load modules
const Site = require('mob-api/models/site')

// Exports module's entry point
module.exports = saveAbout

/**
 * Save info about a fanpage.
 * @param  {ObjectId} siteId   ID of the website to be updated.
 * @param  {String}   objectId ID of the fanpage to be updated.
 * @param  {Object}   info      Info about the fanpage to be updated.
 */
function saveAbout (siteId, objectId, info) {
  let query = {
    '_id': siteId,
    'sources.facebook.fanpages._id': objectId
  }

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
    },

    'sources.facebook.fanpages.$.latestSync.about': new Date()
  }

  Site.update(query, { $set: data }, (err, result) => {
    if (err) {
      throw new Error(err)
    }
  })
}
