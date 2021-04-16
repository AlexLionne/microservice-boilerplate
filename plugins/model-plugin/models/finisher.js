const {Model} = require('objection')
const knex = require('knex')
const guid = require('objection-guid')({
  field: 'finisherId',
});

class Finisher extends guid(Model) {
  static get tableName() {
    return 'finisher';
  }

  static get idColumn() {
    return 'finisherId';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        finisherId: {type: 'string'},
        level: {type: 'int'},
        name: {type: 'string'},
        description: {type: 'string'},
        experience: {type: 'int'},
        repetition: {type: 'int'},
        repetitionType: {type: 'string'},
        betweenSleepTime: {type: 'int'},
      }
    };
  }
}

module.exports = Finisher.bindKnex(knex({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'nesga',
    port: 3306,
  }
}))
