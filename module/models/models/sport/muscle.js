const {Model} = require('objection')
const guid = require('objection-guid')({
    field: 'id',
});
const {config} = require("../../config/knex");

Model.knex(config)

class Muscle extends guid(Model) {
    static get tableName() {
        return 'main.muscle';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: {type: 'string'},
                name: {type: 'string'},
                capacity: {type: 'int'},
                description: {type: 'string'},
            }
        };
    }
}

module.exports = Muscle
