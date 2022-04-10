const {Model} = require('objection')
const knex = require('knex')
const {config} = require("../config/knex");
const guid = require('objection-guid')({
  field: 'finisherTaskId',
});


Model.knex(config)

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
        repetitionType: {type: 'string'},
        order: {type: 'int'},
      }
    };
  }
  static get relationMappings() {
    const Task = require('./task');

    return {
      task: {
        relation: Model.HasOneRelation,
        modelClass: Task,
        join: {
          from: 'task.taskId',
          to: 'finisherTask.taskId',
        }
      }
    }
  }
}

module.exports = FinisherTask
