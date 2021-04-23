const { Model } = require('objection')
const knex = require('knex')
const guid = require('objection-guid')({
  field: 'levelId',
});



class Level extends guid(Model) {
  static get tableName() {
    return 'level';
  }
  static get idColumn() {
    return 'levelId';
  }
  static get jsonSchema () {
    return {
      type: 'object',
      properties: {
        levelId: {type: 'string'},
        name: {type: 'string'},
        experience: {type: 'int'},
        nextExperience: {type: 'int'}
      }
    };
  }
}

module.exports = Level