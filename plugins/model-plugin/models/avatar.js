const {AVATARS_BUCKET, BUCKET_RESOURCE_OPTIONS} = require("../../utils/bucket");

const {Model} = require('objection')
const {Storage} = require('@google-cloud/storage');

const guid = require('objection-guid')({
  field: 'avatarId',
});



const storage = new Storage();

class Avatar extends guid(Model) {
  static get tableName() {
    return 'avatar';
  }

  static get idColumn() {
    return 'avatarId';
  }

  /**
   * Hook to handle avatar URLs
   * @returns {*}
   * @param args
   */
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
        avatarId: {type: 'string'},
        gender: {type: 'string'},
        properties:  {type: 'string'},
        type: {type: 'string'},
      }
    };
  }
}

module.exports = Avatar
