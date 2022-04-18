const {Model} = require('objection');
const {config} = require("../../config/knex");

const guid = require('objection-guid')({
    field: 'id',
});

Model.knex(config)

class FirstUser extends guid(Model) {

    static get tableName() {
        return 'main.first_user';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: {type: 'string'},
                email: {type: 'string'},
                FCMToken: {type: 'string'},
                createdAt: {type: 'timestamp'},
            }
        }
    }
}

module.exports = FirstUser
