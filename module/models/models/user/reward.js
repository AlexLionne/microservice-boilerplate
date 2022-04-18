const {Model} = require('objection')
const {config} = require("../../config/knex");
const guid = require('objection-guid')({
    field: 'id',
});


Model.knex(config)

class Reward extends guid(Model) {
    static get tableName() {
        return 'user.reward';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: {type: 'string'},
                rewardId: {type: 'string'},
                userId: {type: 'string'},
                createdAt: {type: 'timestamp'},
            }
        };
    }
}

module.exports = Reward
