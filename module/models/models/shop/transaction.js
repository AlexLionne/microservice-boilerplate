const {Model} = require('objection')
const knex = require('knex')
const {config} = require("../config/knex");

const guid = require('objection-guid')({
    field: 'id',
});
Model.knex(config)

class Transaction extends guid(Model) {
    static get tableName() {
        return 'shop.transaction';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: {type: 'string'},
                qonversionTransactionId: {type: 'string'},
                userId: {type: 'string'},
                createdAt: {type: 'string'},
                isProceed: {type: 'string'},
                value: {type: 'string'},
                used: {type: 'string'},
                proceedRate: {type: 'string'},
                productId: {type: 'string'},
                platform: {type: 'string'},
                environment: {type: 'string'},
            }
        };
    }
}

module.exports = Transaction
