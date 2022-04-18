const {Model} = require('objection')
const {config} = require("../../config/knex");

const guid = require('objection-guid')({
    field: 'id',
});


Model.knex(config)

class Element extends guid(Model) {
    static get tableName() {
        return 'user.avatarElement';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: {type: 'string'},
                userAvatarId: {type: 'string'},
                avatarElementId: {type: 'string'},
                acquiredDate: {type: 'datetime'},
                isActive: {type: 'int'},
                roughness: {type: 'int'},
                color: {type: 'string'},
                specular: {type: 'int'},
                metallic: {type: 'int'},
            }
        };
    }
}

module.exports = Element
