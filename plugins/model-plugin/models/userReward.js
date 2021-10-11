const { Model } = require('objection')
const {config} = require("../config/knex");
const guid = require('objection-guid')({
  field: 'userRewardId',
});


Model.knex(config)

class UserReward extends guid(Model) {
  static get tableName() {
    return 'userReward';
  }
  static get idColumn() {
    return 'userRewardId';
  }
  static get jsonSchema () {
    return {
      type: 'object',
      properties: {
        userRewardId: {type: 'string'},
        rewardId: {type: 'string'},
        userId: {type: 'string'},
        completionDate: {type: 'string'},
      }
    };
  }
}

module.exports = UserReward
