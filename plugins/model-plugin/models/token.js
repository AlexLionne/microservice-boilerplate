const { Model } = require('objection');
const knex = require('knex')

class Token extends Model {

  static get tableName() {
    return 'users_tokens';
  }

  static get idColumn() {
    return 'tokenID';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        tokenID: {type: 'string', maxLength: 36},
        userID: {type: 'string', maxLength: 36},
        expirationDate:{type: 'string', format: 'date' },
        token: {type: 'string'}
      }
    }
  }
}


module.exports = Token.bindKnex(knex({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'nesga',
    port: 3306,
  }
}))
