const {Model} = require('objection')
const {config} = require("../../config/knex");

const guid = require('objection-guid')({
    field: 'id',
});


Model.knex(config)

class Editable extends guid(Model) {
    static get tableName() {
        return 'main.editable';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: {type: 'string'},
                avatarElementId: {type: 'string'},
                name: {type: 'string'},
                type: {type: 'string'},
            }
        };
    }
}

module.exports = Editable
