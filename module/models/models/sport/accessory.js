const {Model} = require('objection')
const {BUCKET_RESOURCE_OPTIONS} = require("../../../../plugins/utils/bucket");
const guid = require('objection-guid')({
    field: 'id',
});

const {Storage} = require('@google-cloud/storage');
const {config} = require("../../config/knex");
const ACCESSORIES_BUCKET = 'accessories-bucket'
const storage = new Storage();

Model.knex(config)

class Accessory extends guid(Model) {
    static get tableName() {
        return 'sport.accessory';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: {type: 'string'},
                name: {type: 'string'},
                description: {type: 'string'}
            }
        };
    }

    async $afterFind() {

        this.previewUrl = null
        const file = await storage
            .bucket(ACCESSORIES_BUCKET)
            .file(`${this.accessoryId}/preview.png`)

        const [exists] = await file.exists()

        if (exists) {
            const [previewUrl] = await storage
                .bucket(ACCESSORIES_BUCKET)
                .file(`${this.accessoryId}/preview.png`)
                .getSignedUrl({
                    version: 'v4',
                    action: 'read',
                    expires: Date.now() + BUCKET_RESOURCE_OPTIONS, // 3 hours
                })

            this.previewUrl = previewUrl
        }
    }
}

module.exports = Accessory
