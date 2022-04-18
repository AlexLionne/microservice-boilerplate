const {Model} = require('objection')
const {config} = require("../../config/knex");
const guid = require('objection-guid')({
    field: 'id',
});


Model.knex(config)

class Skin extends guid(Model) {
    static get tableName() {
        return 'main.skin';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: {type: 'string'},
                collectionId: {type: 'string'},
                createdAt: {type: 'timestamp'},
                updatedAt: {type: 'timestamp'},
                name: {type: 'string'},
                properties: {type: 'string'},
            }
        };
    }
}

module.exports = Skin
