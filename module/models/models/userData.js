const {Model} = require('objection');
const {config} = require("../config/knex");

const guid = require('objection-guid')({
    field: 'userDataId',
});

Model.knex(config)

class UserData extends guid(Model) {

    static get tableName() {
        return 'userData';
    }

    static get idColumn() {
        return 'userDataId';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                userDataId: {type: 'string'},
                userId: {type: 'string'},
                firstname: {type: 'string'},
                lastname: {type: 'string'},
                username: {type: 'string'},
                birthdate: {type: 'string'},
                gender: {type: 'string'},
                weight: {type: 'string'},
                tall: {type: 'string'},
                experience: {type: 'long'},
                lastSportDate: {type: 'string'},
                workoutsCount: {type: 'int'},
                sportRecurrence: {type: 'int'},
                level: {type: 'int'},
                seriesCount: {type: 'int'},
                nescoins: {type: 'long'},
            }
        };
    }
    static get relationMappings() {
        const UserAvatar = require('./userAvatar');

        return {
            avatar: {
                relation: Model.HasManyRelation,
                modelClass: UserAvatar,
                join: {
                    from: 'userAvatar.userId',
                    to: 'userData.userId'
                }
            },
        }
    }
}

module.exports = UserData
