const {Model} = require('objection')
const knex = require('knex')
const guid = require('objection-guid')({
  field: 'finisherTaskId',
});

class FinisherTask extends guid(Model) {
  static get tableName() {
    return 'finisherTask';
  }

  static get idColumn() {
    return 'finisherTaskId';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        finisherTaskId: {type: 'string'},
        finisherId: {type: 'string'},
        taskId: {type: 'string'},
        repetition: {type: 'int'},
        repetitionType: {type: 'string'}
      }
    };
  }
}

module.exports = FinisherTask.bindKnex(knex({
  client: 'mysql',
  connection: {
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'data',
    port: 8889,
  }
}))
