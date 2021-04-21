const { Model } = require('objection')
const knex = require('knex')
const guid = require('objection-guid')({
  field: 'workoutId',
});



class Workout extends guid(Model) {
  static get tableName() {
    return 'workout';
  }
  static get idColumn() {
    return 'workoutId';
  }
  static get jsonSchema () {
    return {
      type: 'object',
      properties: {
        workoutId: {type: 'string'},
        name: {type: 'string'},
        duration: {type: 'int'},
        videoUrl: {type: 'string'},
        level: {type: 'int'},
        description: {type: 'int'},
        awakingId: {type: 'string'},
        warmumpId: {type: 'string'},
        experience: {type: 'int'}
      }
    };
  }
}

module.exports = Workout
