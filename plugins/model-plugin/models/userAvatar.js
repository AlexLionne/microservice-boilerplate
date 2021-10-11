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
        this.properties = JSON.parse(this.properties)

        try {
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
                console.log(preview)
                this.preview = preview
            } else {
                this.preview = null
            }
        } catch (e) {
            console.log(e)
        }

    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                userAvatarId: {type: 'string'},
                avatarId: {type: 'string'},
                userId: {type: 'string'},
                properties: {type: 'string'},
                skinProperties: {type: 'string'},
                active: {type: 'int'},
            }
        };
    }

    static get relationMappings() {
        const Avatar = require('./avatar');

        return {
            avatar: {
                relation: Model.HasOneRelation,
                modelClass: Avatar,
                join: {
                    from: 'userAvatar.avatarId',
                    to: 'avatar.avatarId'
                }
            },
        }
    }
}

module
    .exports = UserAvatar
