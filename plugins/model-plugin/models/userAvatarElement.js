const {AVATARS_BUCKET, BUCKET_RESOURCE_OPTIONS} = require("../../utils/bucket");

const {Model} = require('objection')
const {Storage} = require('@google-cloud/storage');
const {config} = require("../config/knex");

const guid = require('objection-guid')({
  field: 'userAvatarElementId',
});



const storage = new Storage();


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
