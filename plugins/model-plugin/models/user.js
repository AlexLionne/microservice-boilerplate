const {Model} = require('objection');

const guid = require('objection-guid')({
    field: 'userId',
});


class User extends guid(Model) {

    static get tableName() {
        return 'user';
    }

    static get idColumn() {
        return 'userId';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                userId: {type: 'string'},
                authId: {type: 'string'},
                firstConnectionDate: {type: 'string'},
                lastConnectionDate: {type: 'string'},
                timezone: {type: 'string'},
            }
        };
    }
}

module.exports = User
