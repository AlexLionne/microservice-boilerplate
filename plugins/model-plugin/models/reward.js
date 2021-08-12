const { Model } = require('objection')
const guid = require('objection-guid')({
  field: 'rewardId',
});



class Reward extends guid(Model) {
  static get tableName() {
    return 'reward';
  }
  static get idColumn() {
    return 'rewardId';
  }
  static get jsonSchema () {
    return {
      type: 'object',
      properties: {
        rewardId: {type: 'string'},
        seasonWorkoutId: {type: 'string'},
        type: {type: 'string'},
        value: {type: 'string'}
      }
    };
  }
}

module.exports = Reward
