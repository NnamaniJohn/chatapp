/**
 * Profile.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {

  tableName: 'profiles',

  attributes: {
    userId: {
      type: 'number',
      columnName: 'user_id'
    },
    location: {
      type: 'string',
      columnName: 'location'
    },
    bio: {
      type: 'string',
      columnName: 'bio'
    },
    avatar: {
      type: 'string',
      columnName: 'avatar'
    },

  },

};

