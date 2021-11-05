const {BUCKET_RESOURCE_OPTIONS} = require("../../utils/bucket");
const {Model} = require('objection')
const {Storage} = require('@google-cloud/storage');
const {config} = require("../config/knex");

const storage = new Storage();

const guid = require('objection-guid')({
    field: 'userAvatarId',
});


Model.knex(config)

class UserAvatar extends guid(Model) {
    static get tableName() {
        return 'userAvatar';
    }

    static get idColumn() {
        return 'userAvatarId';
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

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                userAvatarId: {type: 'string'},
                avatarId: {type: 'string'},
                userId: {type: 'string'},
                isActive: {type: 'int'},
            }
        };
    }

    static get relationMappings() {
        const UserAvatarElement = require('./userAvatarElement');

        return {
            elements: {
                relation: Model.HasManyRelation,
                modelClass: UserAvatarElement,
                join: {
                    from: 'userAvatar.userAvatarId',
                    to: 'userAvatarElement.userAvatarId'
                }
            },
        }
    }
}

module
    .exports = UserAvatar
