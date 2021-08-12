const { Model } = require('objection')
const guid = require('objection-guid')({
  field: 'awardId',
});



class Level extends guid(Model) {
  static get tableName() {
    return 'award';
  }
  static get idColumn() {
    return 'awardId';
  }
  static get jsonSchema () {
    return {
      type: 'object',
      properties: {
        awardId: {type: 'string'},
        seasonWorkoutId: {type: 'string'},
        type: {type: 'string'},
        value: {type: 'string'}
      }
    };
  }
}

module.exports = Level
