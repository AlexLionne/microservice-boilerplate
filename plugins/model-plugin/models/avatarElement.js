const {AVATARS_BUCKET, BUCKET_RESOURCE_OPTIONS} = require("../../utils/bucket");

const {Model} = require('objection')
const {Storage} = require('@google-cloud/storage');
const {config} = require("../config/knex");
const AvatarSkin = require("./avatarSkin");

const guid = require('objection-guid')({
    field: 'avatarElementId',
});


const storage = new Storage();


Model.knex(config)

class AvatarElement extends guid(Model) {
    static get tableName() {
        return 'avatarElement';
    }

    static get idColumn() {
        return 'avatarElementId';
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

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                avatarElementId: {type: 'string'},
                name: {type: 'string'},
                avatarSkinId: {type: 'string'},
                type: {type: 'string'},
                bucket: {type: 'string'},
                category: {type: 'string'},
            }
        };
    }
    static get relationMappings() {
        const AvatarElementEditable = require('./avatarElementEditable');

        return {
            editable: {
                relation: Model.HasManyRelation,
                modelClass: AvatarElementEditable,
                join: {
                    from: 'avatarElement.avatarElementId',
                    to: 'avatarElementEditable.avatarElementId'
                }
            },
        }
    }
}

module.exports = AvatarElement
