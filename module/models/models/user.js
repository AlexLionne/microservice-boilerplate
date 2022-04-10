const {Model} = require('objection');
const {config} = require("../config/knex");
const UserClub = require("./userClub");

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
                FCMToken:  {type: 'string'},
                googleId: {type: 'string'},
                appleId: {type: 'string'},
                facebookId: {type: 'string'},
                active: {type: 'tinyint'},
                ban: {type: 'tinyint'},
                admin: {type: 'tinyint'},
            }
        };
    }
    static get relationMappings() {
        const UserClub = require('./userClub');
        const Device = require('./device');
        const UserData = require('./userData');

        return {
            club: {
                relation: Model.HasOneRelation,
                modelClass: UserClub,
                join: {
                    from: 'user.userId',
                    to: 'userClub.userId'
                }
            },
            data: {
                relation: Model.HasOneRelation,
                modelClass: UserData,
                join: {
                    from: 'user.userId',
                    to: 'userData.userId'
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
