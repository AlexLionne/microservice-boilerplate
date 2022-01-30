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
                active: {type: 'tinyint'},
            }
        };
    }
    static get relationMappings() {
        const UserClub = require('./userClub');
        const Device = require('./device');

        return {
            userClub: {
                relation: Model.HasOneRelation,
                modelClass: UserClub,
                join: {
                    from: 'user.userId',
                    to: 'userClub.userId'
                }
            },
            device: {
                relation: Model.HasManyRelation,
                modelClass: Device,
                join: {
                    from: 'user.userId',
                    to: 'device.userId'
                }
            },
        }
    }
}

module.exports = User
