const {AVATARS_BUCKET, BUCKET_RESOURCE_OPTIONS} = require("../../utils/bucket");

const {Model} = require('objection')
const {Storage} = require('@google-cloud/storage');
const {config} = require("../config/knex");

const guid = require('objection-guid')({
  field: 'userAvatarElementId',
});



const storage = new Storage();


Model.knex(config)

class Avatar extends guid(Model) {
  static get tableName() {
    return 'userAvatarElement';
  }

  static get idColumn() {
    return 'userAvatarElementId';
  }

  /**
   * Hook to handle avatar URLs
   * @returns {*}
   * @param args
   */
  async $afterFind(args) {

    /*this.preview = null

    const file = await storage
        .bucket(AVATARS_BUCKET)
        .file(`${this.type}/preview.png`)

    const [exists] = await file.exists()

    if (exists) {
      const [preview] = await storage
          .bucket(AVATARS_BUCKET)
          .file(`${this.type}/preview.png`)
          .getSignedUrl({
            version: 'v4',
            action: 'read',
            expires: Date.now() + BUCKET_RESOURCE_OPTIONS, // 3 hours
          })

      this.preview = preview
      this.properties = JSON.parse(this.properties)
    }*/
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        userAvatarElementId: {type: 'string'},
        userId: {type: 'string'},
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

  static get relationMappings() {
    const AvatarElement = require('./avatarElement');

    return {
      avatarElement: {
        relation: Model.HasOneRelation,
        modelClass: AvatarElement,
        join: {
          from: 'userAvatar.avatarElementId',
          to: 'avatarElement.avatarElementId'
        }
      },
    }
  }


}

module.exports = Avatar
