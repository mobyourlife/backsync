'use strict'

module.exports = (fanpageId) => {
  return {
    version: '2.5',
    method: 'GET',
    endpoint: `${fanpageId}/posts`,
    fields: [
      'id',
      'created_time',
      'updated_time',
      'is_published',
      'is_hidden',
      'scheduled_publish_time',
      'message',
      'type',
      'status_type',
      'story',
      'link',
      'name',
      'caption',
      'description',
      'object_id',
      'picture'
    ]
  }
}
