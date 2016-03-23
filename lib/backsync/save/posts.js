'use strict'

// Load modules
const url = require('url')
const Site = require('mob-api/models/site')
const Content = require('mob-api/models/content')

// Exports module's entry point
module.exports = savePosts

/**
 * Save multiple posts from a fanpage.
 * @param  {ObjectId} siteId           ID of the website to be updated.
 * @param  {String}   objectId         ID of the fanpage to be updated.
 * @param  {Object}   info             Array with posts to be saved.
 * @param  {Function} enqueueCallback  Callback to the enqueue function.
 */
function savePosts (siteId, objectId, info, enqueueCallback) {
  let wait = []

  for (var p of info.data) {
    wait.push(savePost(siteId, objectId, p))
  }

  // Await for all posts to be saved to the database
  Promise.all(wait).then(() => {
    console.log('Finished saving ' + info.data.length + ' posts for siteId ' + siteId + '!')

    // Update posts latest sync time
    let query = {
      '_id': siteId,
      'sources.facebook.fanpages._id': objectId
    }

    let data = {
      'sources.facebook.fanpages.$.latestSync.posts': new Date()
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
        type: 'posts',
        limit: parts.query.limit,
        until: parts.query.until,
        __paging_token: parts.query.__paging_token
      }

      enqueueCallback(data)
    }
  }, (err) => {
    console.error('Error saving posts: ' + err)
  })
}

/**
 * Save a post from a fanpage.
 * @param  {ObjectId} siteId   ID of the website to be updated.
 * @param  {String}   objectId ID of the fanpage to be updated.
 * @param  {Object}   info     Info about the post to be saved.
 */
function savePost (siteId, objectId, info) {
  console.log('Saving post ' + info.id)

  let query = {
    'siteId': siteId,
    'sourceType': 'facebook',
    'facebook.fanpageId': objectId,
    'facebook.contentType': 'post',
    'facebook.post._id': info.id
  }

  let data = {
    siteId: siteId,
    sourceType: 'facebook',

    facebook: {
      fanpageId: objectId,
      contentType: 'post',

      createdTime: info.created_time,
      updatedTime: info.updated_time,
      syncedTime: new Date(),

      isPublished: info.is_published,
      isHidden: info.is_hidden,
      scheduledPublishTime: info.scheduled_publish_time,

      post: {
        _id: info.id,
        message: info.message,
        postType: info.type,
        statusType: info.status_type,
        story: info.story,
        link: info.link,
        name: info.name,
        caption: info.caption,
        description: info.description,
        object_id: info.object_id,
        picture: info.picture
      }
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
