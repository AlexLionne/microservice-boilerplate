const {Model} = require('objection')
const guid = require('objection-guid')({
    field: 'muscleId',
});
const {config} = require("../config/knex");

Model.knex(config)

class Muscle extends guid(Model) {
    static get tableName() {
        return 'muscle';
    }

    static get idColumn() {
        return 'muscleId';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                muscleId: {type: 'string'},
                name: {type: 'string'},
                capacity: {type: 'int'},
                description: {type: 'string'},
            }
        };
    }
}

module.exports = Muscle
