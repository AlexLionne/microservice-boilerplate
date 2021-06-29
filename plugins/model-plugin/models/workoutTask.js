const { Model } = require('objection')
const knex = require('knex')
const guid = require('objection-guid')({
  field: 'workoutTaskId',
});

class WorkoutTask extends guid(Model) {
  static get tableName() {
    return 'workoutTask';
  }
  static get idColumn() {
    return 'workoutTaskId';
  }
  static get jsonSchema () {
    return {
      type: 'object',
      properties: {
        workoutTaskId: {type: 'string'},
        workoutId: {type: 'string'},
        taskId: {type: 'string'},
        repetition: {type: 'int'},
        repetitionType: {type: 'string'},
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
          to: 'workoutTask.taskId'
        }
      }
    }
  }
}

module.exports = WorkoutTask
