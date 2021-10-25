const {Model} = require('objection')
const {config} = require("../config/knex");
const guid = require('objection-guid')({
    field: 'avatarSkinId',
});


Model.knex(config)

class AvatarSkin extends guid(Model) {
    static get tableName() {
        return 'avatarSkin';
    }

    static get idColumn() {
        return 'avatarSkinId';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                avatarSkinId: {type: 'string'},
                avatarId: {type: 'string'},
                name: {type: 'string'},
            }
        };
    }

    static get relationMappings() {
        const AvatarSkin = require('./avatarSkin');

        return {
            avatar: {
                relation: Model.HasOneRelation,
                modelClass: AvatarSkin,
                join: {
                    from: 'avatarSkin.avatarId',
                    to: 'avatar.avatarId'
                }
            },
        }
    }

}

module.exports = AvatarSkin
