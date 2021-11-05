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


  async $afterFind(args) {

    this.preview = null

    const file = await storage
        .bucket(AVATARS_BUCKET)
        .file(`${this.type}/${this.name}.png`)

    const [exists] = await file.exists()

    if (exists) {
      const [preview] = await storage
          .bucket(AVATARS_BUCKET)
          .file(`${this.type}/${this.name}.png`)
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
        avatarElementId: {type: 'string'},
        name: {type: 'string'},
        avatarSkinId: {type: 'string'},
        type: {type: 'string'},
      }
    };
  }
}

module.exports = Avatar
