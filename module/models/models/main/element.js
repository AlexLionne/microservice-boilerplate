const {AVATARS_BUCKET, BUCKET_RESOURCE_OPTIONS} = require("../../../../plugins/utils/bucket");

const {Model} = require('objection')
const {Storage} = require('@google-cloud/storage');
const {config} = require("../../config/knex");

const guid = require('objection-guid')({
    field: 'id',
});


const storage = new Storage();


Model.knex(config)

class Element extends guid(Model) {
    static get tableName() {
        return 'main.element';
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
                avatarSkinId: {type: 'string'},
                type: {type: 'string'},
                bucket: {type: 'string'},
                category: {type: 'string'},
                removable: {type: 'int'},
            }
        };
    }

    static get relationMappings() {
        const Editable = require('./editable');

        return {
            editable: {
                relation: Model.HasManyRelation,
                modelClass: Editable,
                join: {
                    from: 'avatarElement.avatarElementId',
                    to: 'avatarElementEditable.avatarElementId'
                }
            },
        }
    }

    async $afterFind(args) {

        if (this.canPreview) {

            this.preview = null

            const file = await storage
                .bucket(AVATARS_BUCKET)
                .file(`${this.bucket}/${this.type}/${this.name}.png`)

            const [exists] = await file.exists()

            if (exists) {
                const [preview] = await storage
                    .bucket(AVATARS_BUCKET)
                    .file(`${this.bucket}/${this.type}/${this.name}.png`)
                    .getSignedUrl({
                        version: 'v4',
                        action: 'read',
                        expires: Date.now() + BUCKET_RESOURCE_OPTIONS, // 3 hours
                    })

                this.preview = preview
            }
        }

    }
}

module.exports = Element
