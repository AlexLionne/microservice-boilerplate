const { Model } = require('objection')
const knex = require('knex')
const guid = require('objection-guid')({
  field: 'awakingTaskId',
});



class AwakingTask extends guid(Model) {
  static get tableName() {
    return 'awakingTask';
  }
  static get idColumn() {
    return 'awakingTaskId';
  }
  static get jsonSchema () {
    return {
      type: 'object',
      properties: {
        awakingTaskId: {type: 'string'},
        awakingId: {type: 'string'},
        taskId: {type: 'string'},
        repetition: {type: 'int'},
        repetitionType: {type: 'string'},
      }
    };
  }
}

module.exports = AwakingTask
