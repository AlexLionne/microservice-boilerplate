const { Model } = require('objection')
const knex = require('knex')
const guid = require('objection-guid')({
  field: 'awakingId',
});



class Awaking extends guid(Model) {
  static get tableName() {
    return 'awaking';
  }
  static get idColumn() {
    return 'awakingId';
  }
  static get jsonSchema () {
    return {
      type: 'object',
      properties: {
        awakingId: {type: 'string'},
        name: {type: 'string'},
        description: {type: 'string'},
        experience: {type: 'int', value: 15}
      }
    };
  }
}

module.exports = Awaking
