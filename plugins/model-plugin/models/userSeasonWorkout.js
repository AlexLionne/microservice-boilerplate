const { Model } = require('objection')
const knex = require('knex')
const guid = require('objection-guid')({
  field: 'userSeasonWorkoutId',
});



class UserSeasonWorkout extends guid(Model) {
  static get tableName() {
    return 'userSeasonWorkout';
  }
  static get idColumn() {
    return 'userSeasonWorkoutId';
  }
  static get jsonSchema () {
    return {
      type: 'object',
      properties: {
        userSeasonWorkoutId: {type: 'string'},
        seasonWorkoutId: {type: 'string'},
        userId: {type: 'string'},
        feelings: {type: 'int'},
        endTime: {type: 'time'},
        averageCaloriesBurned: {type: 'long'},
      }
    };
  }
}

module.exports = UserSeasonWorkout
