const {Model} = require('objection');
const {config} = require("../../config/knex");

const guid = require('objection-guid')({
    field: 'id',
});


Model.knex(config)

class User extends guid(Model) {

    static get tableName() {
        return 'main.user';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: {type: 'string'},
                authId: {type: 'string'},
                email: {type: 'string'},
                username: {type: 'string'},
                createdAt: {type: 'string'},
                FCMToken: {type: 'string'}
            }
        };
    }
}

module.exports = User
