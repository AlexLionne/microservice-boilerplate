const {Model} = require('objection')
const knex = require('knex')
const guid = require('objection-guid')({
  field: 'accessoryId',
});

class Accessory extends guid(Model) {
  static get tableName() {
    return 'accessory';
  }

  static get idColumn() {
    return 'accessoryId';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        accessoryId: {type: 'string'},
        name: {type: 'string'},
        description: {type: 'string'},
        url: {type: 'string'},
      }
    };
  }
}

module.exports = Accessory.bindKnex(knex({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'nesga',
    port: 3306,
  }
}))
