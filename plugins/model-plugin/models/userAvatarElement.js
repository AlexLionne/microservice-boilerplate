const {Model} = require('objection')
const {config} = require("../config/knex");

const guid = require('objection-guid')({
  field: 'userAvatarElementId',
});



Model.knex(config)

class UserAvatarElement extends guid(Model) {
  static get tableName() {
    return 'userAvatarElement';
  }

  static get idColumn() {
    return 'userAvatarElementId';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        userAvatarElementId: {type: 'string'},
        userAvatarId: {type: 'string'},
        avatarElementId: {type: 'string'},

        acquiredDate: {type: 'datetime'},
        isActive:  {type: 'int'},

        roughness:  {type: 'int'},
        color:  {type: 'string'},
        specular:  {type: 'int'},
        metallic:  {type: 'int'},
      }
    };
  }
}

module.exports = UserAvatarElement
