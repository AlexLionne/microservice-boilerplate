const {Model} = require('objection')
const knex = require('knex')
const guid = require('objection-guid')({
  field: 'skinCollectionId',
});

class SkinCollection extends guid(Model) {
  static get tableName() {
    return 'skinCollection';
  }

  static get idColumn() {
    return 'skinCollectionId';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        skinCollectionId: {type: 'string'},
        title: {type: 'string'},
        description: {type: 'string'},
      }
    };
  }
}

module.exports = SkinCollection