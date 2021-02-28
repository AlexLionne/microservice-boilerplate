const { Model } = require('objection')
const knex = require('knex')

class Auth extends Model {
  static get tableName() {
    return 'auth';
  }
  static get idColumn() {
    return 'authID';
  }
  static get jsonSchema () {
    return {
      type: 'object',
      properties: {
        authID: {type: 'string', maxLength: 36},
        userID: {type: 'string', maxLength: 36},
        password: {type: 'string', minLength: 8, maxLength: 12},
      }
    };
  }
}

const server = process.env.NODE_ENV === 'production' ? '10.0.0.21' : 'kinora.io'

module.exports = Auth.bindKnex(knex('mysql', 'eventdesk', 'kinora', 'E2KqYT9w9qvhKHGK', server, 8701))
