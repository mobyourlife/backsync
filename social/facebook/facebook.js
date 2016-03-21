'use strict'

// Load modules
var FB = require('fb')
var about = require('./data/about')

// Export Facebook integration
module.exports = Facebook

/**
 * Module responsible for integrating with the Facebook API.
 */
function Facebook () {
  // Middlewares to the Facebook API
  this.auth = auth
  this.singleRequest

  // Data definitions for calling the API
  this.about = about
}

// Authenticate
function auth (clientId, clientSecret) {
  if (!clientId) clientId = process.env.FACEBOOK_CLIENT_ID
  if (!clientSecret) clientSecret = process.env.FACEBOOK_CLIENT_SECRET

  return new Promise((resolve, reject) => {
    if (!clientId || !clientSecret) {
      reject('Must supply authentication credentials!')
    } else {
      // Attempt to authenticate
      FB.api('oauth/access_token', {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'client_credentials'
      }, (res) => {
        if (!res) {
          reject('Empty response!')
        } else if (res.error) {
          reject(res.error)
        } else {
          // Set access token globally when successfully authenticated
          FB.setAccessToken(res.acess_token)
          resolve()
        }
      })
    }
  })
}

/**
 * Make endpoint for a new request.
 * @param  {Object} options Object containing endpoint settings.
 * @return {String}         Formated endpoint.
 */
function makeEndpoint (options) {
  let endpoint = ''

  // Append version field
  if (options.version) {
    endpoint += '/v' + options.version
  }

  // API endpoint
  endpoint += '/' + options.endpoint

  // Filter which fields will be selected
  if (options.fields) {
    endpoint += '?fields='
    endpoint += options.fields.join(',')
  }

  return endpoint
}

/**
 * Performs a single request to Facebook API.
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
function singleRequest (options) {
  return new Promise((resolve, reject) => {
    let endpoint = makeEndpoint(options)

    FB.api(endpoint, options.data, (res) => {
      if (!res) {
        reject('Empty response!')
      } else if (res.error) {
        reject(res.error)
      } else {
        resolve(res)
      }
    })
  })
}
