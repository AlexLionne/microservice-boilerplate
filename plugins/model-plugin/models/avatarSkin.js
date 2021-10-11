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
                skinId: {type: 'string'},
                url: {type: 'string'},
                preview: {type: 'string'},
            }
        };
    }
}

module.exports = AvatarSkin
