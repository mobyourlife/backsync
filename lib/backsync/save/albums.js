'use strict'

// Load modules
const url = require('url')
const Site = require('mob-api/models/site')
const Content = require('mob-api/models/content')

// Exports module's entry point
module.exports = saveAlbums

/**
 * Save multiple albums from a fanpage.
 * @param  {ObjectId} siteId           ID of the website to be updated.
 * @param  {String}   objectId         ID of the fanpage to be updated.
 * @param  {Object}   info             Array with albums to be saved.
 * @param  {Function} enqueueCallback  Callback to the enqueue function.
 */
function saveAlbums (siteId, objectId, info, enqueueCallback) {
  let wait = []

  for (var p of info.data) {
    wait.push(saveAlbum(siteId, objectId, p))
  }

  // Await for all albums to be saved to the database
  Promise.all(wait).then(() => {
    console.log('Finished saving ' + info.data.length + ' albums for siteId ' + siteId + '!')

    // Update albums latest sync time
    let query = {
      '_id': siteId,
      'sources.facebook.fanpages._id': objectId
    }

    let data = {
      'sources.facebook.fanpages.$.latestSync.albums': new Date()
    }

    Site.update(query, { $set: data }, (err, result) => {
      if (err) {
        throw new Error(err)
      }
    })

    // Should query next pages
    if (info.paging && info.paging.next) {
      let parts = url.parse(info.paging.next, true)

      // Compose new request to be enqueue
      let data = {
        siteId: siteId,
        objectId: objectId,
        type: 'albums',
        limit: parts.query.limit,
        until: parts.query.until,
        __paging_token: parts.query.__paging_token
      }

      enqueueCallback(data)
    }
  }, (err) => {
    console.error('Error saving albums: ' + err)
  })
}

/**
 * Save a album from a fanpage.
 * @param  {ObjectId} siteId   ID of the website to be updated.
 * @param  {String}   objectId ID of the fanpage to be updated.
 * @param  {Object}   info     Info about the album to be saved.
 */
function saveAlbum (siteId, objectId, info) {
  console.log('Saving album ' + info.id)

  let query = {
    'siteId': siteId,
    'sourceType': 'facebook',
    'facebook.fanpageId': objectId,
    'facebook.contentType': 'album',
    'facebook.album._id': info.id
  }

  let data = {
    siteId: siteId,
    sourceType: 'facebook',

    facebook: {
      fanpageId: objectId,
      contentType: 'album',

      createdTime: info.created_time,
      updatedTime: info.updated_time,
      syncedTime: new Date(),

      album: {
        _id: info.id,
        name: info.name,
        description: info.description,
        location: info.location,
        albumType: info.type,
        count: info.count
      }
    }
  }

  if (info.cover_photo) {
    data.facebook.album.coverPhoto = {
      _id: info.cover_photo.id,
      createdTime: info.cover_photo.created_time,
      name: info.cover_photo.name
    }
  }

  return new Promise((resolve, reject) => {
    Content.update(query, data, { upsert: true }, (err, result) => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
