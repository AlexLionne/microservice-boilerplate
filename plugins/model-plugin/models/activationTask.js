const { Model } = require('objection')
const knex = require('knex')
const guid = require('objection-guid')({
  field: 'activationTaskId',
});



class ActivationTask extends guid(Model) {
  static get tableName() {
    return 'activationTask';
  }
  static get idColumn() {
    return 'activationTaskId';
  }
  static get jsonSchema () {
    return {
      type: 'object',
      properties: {
        activationTaskId: {type: 'string'},
        activationId: {type: 'string'},
        taskId: {type: 'string'},
        repetition: {type: 'int'},
        repetitionType: {type: 'string'},
      }
    };
  }
}

module.exports = ActivationTask
