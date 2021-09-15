const { Model } = require('objection')
const guid = require('objection-guid')({
  field: 'activationId',
});



class Activation extends guid(Model) {
  static get tableName() {
    return 'activation';
  }
  static get idColumn() {
    return 'activationId';
  }
  static get jsonSchema () {
    return {
      type: 'object',
      properties: {
        activationId: {type: 'string'},
        name: {type: 'string'},
        description: {type: 'string'},
        experience: {type: 'int', value: 15}
      }
    };
  }

  static get relationMappings() {
    const ActivationTask = require('./activationTask');

    return {
      tasks: {
        relation: Model.ActivationTask,
        modelClass: ActivationTask,
        join: {
          from: 'activation.activationId',
          to: 'activationTask.activationId'
        }
      },
    }
  }
}

module.exports = Activation
