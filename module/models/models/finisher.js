const {Model} = require('objection')
const knex = require('knex')
const {config} = require("../config/knex");
const guid = require('objection-guid')({
  field: 'finisherId',
});


Model.knex(config)

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
  static get relationMappings() {
    const FinisherTask = require('./finisherTask');

    return {
      tasks: {
        relation: Model.HasManyRelation,
        modelClass: FinisherTask,
        join: {
          from: 'finisher.finisherId',
          to: 'finisherTask.finisherId'
        }
      }
    }
  }

}

module.exports = Finisher
