const {BUCKET_RESOURCE_OPTIONS} = require("../../../../plugins/utils/bucket");
const {Model} = require('objection')
const {Storage} = require('@google-cloud/storage');
const {config} = require("../../config/knex");

const storage = new Storage();

const guid = require('objection-guid')({
    field: 'id',
});


Model.knex(config)

class Avatar extends guid(Model) {
    static get tableName() {
        return 'user.avatar';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: {type: 'string'},
                avatarId: {type: 'string'},
                userId: {type: 'string'},
                isActive: {type: 'int'},
            }
        };
    }

    static get relationMappings() {
        const Element = require('./element');
        const Avatar = require('./avatar');

        return {
            avatar: {
                relation: Model.HasOneRelation,
                modelClass: Avatar,
                join: {
                    from: 'user.avatar.id',
                    to: 'main.avatar.id'
                }
            },
            elements: {
                relation: Model.HasManyRelation,
                modelClass: Element,
                join: {
                    from: 'user.avatar.id',
                    to: 'main.element.avatarId'
                }
            },
        }
    }

    async $afterFind(args) {
        this.preview = null

        const file = await storage
            .bucket('all-users-avatars')
            .file(`${this.userId}/preview.png`)

        const [exists] = await file.exists()

        if (exists) {
            const [preview] = await storage
                .bucket('all-users-avatars')
                .file(`${this.userId}/preview.png`)
                .getSignedUrl({
                    version: 'v4',
                    action: 'read',
                    expires: Date.now() + BUCKET_RESOURCE_OPTIONS, // 3 hours
                })
            this.preview = preview
        }
    }
}

module
    .exports = Avatar
