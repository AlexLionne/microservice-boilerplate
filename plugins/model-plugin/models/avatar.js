const {AVATARS_BUCKET, BUCKET_RESOURCE_OPTIONS} = require("../../utils/bucket");

const {Model} = require('objection')
const {Storage} = require('@google-cloud/storage');
const {config} = require("../config/knex");

const guid = require('objection-guid')({
  field: 'avatarId',
});



const storage = new Storage();


Model.knex(config)

class Avatar extends guid(Model) {
  static get tableName() {
    return 'avatar';
  }

  static get idColumn() {
    return 'avatarId';
  }


  async $afterFind(args) {

    this.preview = null

    const file = await storage
        .bucket(AVATARS_BUCKET)
        .file(`${this.type}/base/preview.png`)

    const [exists] = await file.exists()

    if (exists) {
      const [preview] = await storage
          .bucket(AVATARS_BUCKET)
          .file(`${this.type}/base/preview.png`)
          .getSignedUrl({
            version: 'v4',
            action: 'read',
            expires: Date.now() + BUCKET_RESOURCE_OPTIONS, // 3 hours
          })

      this.preview = preview
    }
  }

  static get jsonSchema() {
    return {
      type: 'object',
      properties: {
        avatarId: {type: 'string'},
        name: {type: 'string'},
        type: {type: 'string'},
      }
    };
  }

  static get relationMappings() {
    const AvatarSkin = require('./avatarSkin');

    return {
      skins: {
        relation: Model.HasManyRelation,
        modelClass: AvatarSkin,
        join: {
          from: 'avatar.avatarId',
          to: 'avatarSkin.avatarId'
        }
      },
    }
  }

}

module.exports = Avatar
