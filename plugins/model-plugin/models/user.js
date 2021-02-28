const { Model } = require('objection');
const knex = require('knex')

class User extends Model {

  static get tableName() {
    return 'users';
  }
  static get idColumn() {
    return 'userID';
  }

  static get jsonSchema () {
    return {
      type: 'object',
      properties: {
        userID: {type: 'string'},
        email: {type: 'string', minLength: 1, maxLength: 30},
        firstConnectionDate: {type: 'string', format: 'date' },
        lastConnectionDate:{type: 'string', format: 'date' },
        creationDate: {type: 'string', format: 'date' },
        isAdmin: {type: 'integer'}
      }
    };
  }
}

const server = process.env.NODE_ENV === 'production' ? '10.0.0.21' : 'kinora.io'

module.exports = User.bindKnex(knex('mysql', 'eventdesk', 'kinora', 'E2KqYT9w9qvhKHGK', server, 8701))
