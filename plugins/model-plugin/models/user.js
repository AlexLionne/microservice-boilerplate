const {Model} = require('objection');
const {config} = require("../config/knex");

const guid = require('objection-guid')({
    field: 'userId',
});


Model.knex(config)


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
    static get relationMappings() {
        const UserClub = require('./userClub');

        return {
            userClub: {
                relation: Model.HasOneRelation,
                modelClass: UserClub,
                join: {
                    from: 'user.userId',
                    to: 'userClub.userId'
                }
            },
        }
    }
}

module.exports = User
