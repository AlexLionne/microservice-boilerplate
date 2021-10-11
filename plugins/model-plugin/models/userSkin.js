const {Model} = require('objection')
const {config} = require("../config/knex");

const guid = require('objection-guid')({
  field: 'userSkinId',
});


Model.knex(config)

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
