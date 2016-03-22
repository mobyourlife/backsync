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
  this.accessToken = ''

  // Middlewares to the Facebook API
  this.auth = auth.bind(this)
  this.singleRequest = singleRequest.bind(this)

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
          this.accessToken = res.access_token
          resolve()
        }
      })
    }
  })
}

/**
 * Make endpoint for a new request.
 * @param  {Object} request Object containing request settings.
 * @return {String}         Formated endpoint.
 */
function makeEndpoint (request) {
  let endpoint = ''

  // Append version field
  if (request.version) {
    endpoint += '/v' + request.version
  }

  // API endpoint
  endpoint += '/' + request.endpoint

  // Filter which fields will be selected
  if (request.fields) {
    endpoint += '?fields='
    endpoint += request.fields.join(',')
  }

  return endpoint
}

/**
 * Performs a single request to Facebook API.
 * @param  {[type]} request [description]
 * @return {[type]}         [description]
 */
function singleRequest (request) {
  return new Promise((resolve, reject) => {
    let endpoint = makeEndpoint(request)

    let options = {
      access_token: this.accessToken
    }

    console.log('FB API:', endpoint)

    FB.api(endpoint, options, (res) => {
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
