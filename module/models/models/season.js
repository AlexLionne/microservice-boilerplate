const {Model} = require('objection')
const {config} = require("../config/knex");
const Workout = require("./workout");
const guid = require('objection-guid')({
  field: 'seasonId',
});


Model.knex(config)

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
        referredSeasonId: {type: 'string'},
      }
    };
  }
  static get relationMappings() {
    const SeasonWorkout = require('./seasonWorkout');

    return {
      workouts: {
        relation: Model.HasManyRelation,
        modelClass: SeasonWorkout,
        join: {
          from: 'season.seasonId',
          to: 'seasonWorkout.seasonId'
        }
      },
    }
  }
}

module.exports = Season
