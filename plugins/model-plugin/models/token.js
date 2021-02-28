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

const server = process.env.NODE_ENV === 'production' ? 'nesga.fr' : 'nesga.fr'

module.exports = Token.bindKnex(knex('mysql', 'eventdesk', 'nesga', 'pwd', server, 8701))
