const {Model} = require('objection')
const {config} = require("../config/knex");

const guid = require('objection-guid')({
    field: 'avatarElementEditableId',
});


Model.knex(config)

class AvatarElementEditable extends guid(Model) {
    static get tableName() {
        return 'avatarElementEditable';
    }

    static get idColumn() {
        return 'avatarElementEditableId';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                avatarElementEditableId: {type: 'string'},
                avatarElementId: {type: 'string'},
                name: {type: 'string'},
                value: {type: 'string'},
            }
        };
    }
}

module.exports = AvatarElementEditable
