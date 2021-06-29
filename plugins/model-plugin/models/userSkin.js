const {Model} = require('objection')

const guid = require('objection-guid')({
  field: 'userSkinId',
});

class UserSkin extends guid(Model) {
  static get tableName() {
    return 'userSkin';
  }

  static get idColumn() {
    return 'userSkinId';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        userSkinId: {type: 'string'},
        skinId: {type: 'string'},
        userId: {type: 'string'},
        acquiredDate: {type: 'datetime'},
      }
    };
  }
}

module.exports = UserSkin
