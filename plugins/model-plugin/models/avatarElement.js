const {AVATARS_BUCKET, BUCKET_RESOURCE_OPTIONS} = require("../../utils/bucket");

const {Model} = require('objection')
const {Storage} = require('@google-cloud/storage');
const {config} = require("../config/knex");

const guid = require('objection-guid')({
  field: 'avatarElementId',
});



const storage = new Storage();


Model.knex(config)

class Avatar extends guid(Model) {
  static get tableName() {
    return 'avatarElement';
  }

  static get idColumn() {
    return 'avatarElementId';
  }

  /**
   * Hook to handle avatar URLs
   * @returns {*}
   * @param args

  async $afterFind(args) {

    this.preview = null

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
    }
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        avatarElementId: {type: 'string'},
        name: {type: 'string'},
        avatarSkinId: {type: 'string'},
      }
    };
  }*/

  static get relationMappings() {
    const AvatarSkin = require('./avatarSkin');

    return {
      avatar: {
        relation: Model.HasOneRelation,
        modelClass: AvatarSkin,
        join: {
          from: 'avatarElement.avatarSkinId',
          to: 'avatarSkin.avatarSkinId'
        }
      },
    }
  }
}

module.exports = Avatar
