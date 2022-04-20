const {Model} = require('objection');
const {config} = require("../../config/knex");

const guid = require('objection-guid')({
    field: 'id',
});

Model.knex(config)

class Information extends guid(Model) {

    static get tableName() {
        return 'user.information';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: {type: 'uuid'},
                userId: {type: 'uuid'},
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
                firstConnectionDate: {type: 'string'},
                lastConnectionDate: {type: 'string'},
                timezone: {type: 'string'},
                FCMToken: {type: 'string'},
                active: {type: 'bool'},
                ban: {type: 'bool'},
            }
        };
    }

    static get relationMappings() {
        const Avatar = require('./avatar');

        return {
            avatar: {
                relation: Model.HasManyRelation,
                modelClass: Avatar,
                join: {
                    from: 'user.avatar.userId',
                    to: 'information.userId'
                }
            },
        }
    }
}

module.exports = Information
