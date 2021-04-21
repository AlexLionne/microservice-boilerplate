const {Model} = require('objection')
const knex = require('knex')
const guid = require('objection-guid')({
  field: 'skinId',
});

class Skin extends guid(Model) {
  static get tableName() {
    return 'skin';
  }

  static get idColumn() {
    return 'skinId';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        skinId: {type: 'string'},
        skinCollectionId: {type: 'string'},
        name: {type: 'string'},
        properties: {type: 'string'},
      }
    };
  }
}

module.exports = Skin
