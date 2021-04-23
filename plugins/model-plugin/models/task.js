const {Model} = require('objection')
const guid = require('objection-guid')({
  field: 'taskId',
});

class Task extends guid(Model) {
  static get tableName() {
    return 'task';
  }

  static get idColumn() {
    return 'taskId';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        taskId: {type: 'string'},
        name: {type: 'string'},
        experience: {type: 'int'},
        level: {type: 'int'},
        videoUrl: {type: 'string'},
        bodyArea: {type: 'string'},
      }
    };
  }
}


module.exports = Task