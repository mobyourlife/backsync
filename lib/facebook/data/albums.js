'use strict'

module.exports = (fanpageId) => {
  return {
    version: '2.5',
    method: 'GET',
    endpoint: `${fanpageId}/albums`,
    fields: [
      'id',
      'created_time',
      'updated_time',
      'is_hidden',
      'name',
      'description',
      'location',
      'cover_photo',
      'type',
      'count'
    ]
  }
}
