const {Model} = require('objection')
const guid = require('objection-guid')({
  field: 'seasonId',
});

class Season extends guid(Model) {
  static get tableName() {
    return 'season';
  }

  static get idColumn() {
    return 'seasonId';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        seasonId: {type: 'string'},
        name: {type: 'string'},
        description: {type: 'string'},
        active: {type: 'int'},
        startDate: {type: 'string'},
        enDate: {type: 'string'},
        version: {type: 'int'},
      }
    };
  }
}

module.exports = Season
