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

module.exports = User.bindKnex(knex({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'nesga',
    port: 8889,
  }
}))
