const { Model } = require('objection');

const guid = require('objection-guid')({
  field: 'userTokenId',
});

class Token extends guid(Model) {

  static get tableName() {
    return 'userToken';
  }

  static get idColumn() {
    return 'userTokenId';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        userTokenId: {type: 'string', maxLength: 36},
        userId: {type: 'string', maxLength: 36},
        token: {type: 'string'}
      }
    }
  }
}


module.exports = Token
