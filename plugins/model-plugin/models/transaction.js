const {Model} = require('objection')
const knex = require('knex')
const {config} = require("../config/knex");


Model.knex(config)

class Transaction extends Model {
  static get tableName() {
    return 'transaction';
  }

  static get idColumn() {
    return 'transactionId';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        transactionId: {type: 'string'},
        userId: {type: 'string'},
        createdAt: {type: 'datetime'},
        isProceed: {type: 'tinyint'},
        value: {type: 'string'},
        used: {type: 'string'},
        proceedRate: {type: 'string'},
        productId: {type: 'string'},
        platform: {type: 'string'},
        environment: {type: 'string'},
      }
    };
  }
}

module.exports = Transaction
