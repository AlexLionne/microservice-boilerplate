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

module.exports = Auth.bindKnex(knex({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'nesga',
    port: 3306,
  }
}))
