const {Model} = require('objection')
const knex = require('knex')
const {config} = require("../../config/knex");
const guid = require('objection-guid')({
    field: 'id',
});


Model.knex(config)

class Collection extends guid(Model) {
    static get tableName() {
        return 'main.collection';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: {type: 'string'},
                title: {type: 'string'},
                description: {type: 'string'},
            }
        };
    }
}

module.exports = Collection
