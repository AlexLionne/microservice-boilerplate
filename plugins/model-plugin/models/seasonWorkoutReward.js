const {Model} = require('objection')
const guid = require('objection-guid')({
  field: 'seasonWorkoutRewardId',
});

class SeasonWorkoutReward extends guid(Model) {
  static get tableName() {
    return 'seasonWorkoutReward';
  }

  static get idColumn() {
    return 'seasonWorkoutRewardId';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        seasonWorkoutRewardId: {type: 'string'},
        seasonWorkoutId: {type: 'string'},
        rewardType: {type: 'string'}, //skin, nescoins
        reward: {type: 'string'}, //skinUrl
        //rewardPreview: {type: 'string'}, //skinPreviewUrl
      }
    };
  }
}

module.exports = SeasonWorkoutReward
