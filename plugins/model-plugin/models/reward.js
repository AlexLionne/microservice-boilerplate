const {Model} = require('objection')
const {config} = require("../config/knex");
const guid = require('objection-guid')({
    field: 'rewardId',
});

Model.knex(config)

class Reward extends guid(Model) {
    static get tableName() {
        return 'reward';
    }

    static get idColumn() {
        return 'rewardId';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                rewardId: {type: 'string'},
                title: {type: 'string'},
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
