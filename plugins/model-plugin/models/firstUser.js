const {Model} = require('objection');

const guid = require('objection-guid')({
    field: 'firstUserId',
});

class FirstUser extends guid(Model) {

    static get tableName() {
        return 'firstUser';
    }

    static get idColumn() {
        return 'firstUserId';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                firstUserId: {type: 'string', maxLength: 36},
                email: {type: 'string', maxLength: 100},
                FCMToken: {type: 'string'},
                registrationDate: {type: 'string'},
            }
        }
    }
}

module.exports = FirstUser
