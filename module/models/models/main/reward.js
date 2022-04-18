const {Model} = require('objection')
const {config} = require("../../config/knex");
const guid = require('objection-guid')({
    field: 'id',
});

Model.knex(config)

class Reward extends guid(Model) {
    static get tableName() {
        return 'main.reward';
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
                description: {type: 'string'},
                type: {type: 'string'},
                seasonId: {type: 'string'},
                value: {type: 'string'},
                premium: {type: 'integer'},
                constraints: {type: 'integer'}
            }
        };
    }
}

module.exports = Reward
