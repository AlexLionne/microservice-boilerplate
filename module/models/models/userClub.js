const {Model} = require('objection');
const {config} = require("../config/knex");

const guid = require('objection-guid')({
    field: 'userClubId',
});


Model.knex(config)


class UserClub extends guid(Model) {

    static get tableName() {
        return 'userClub';
    }

    static get idColumn() {
        return 'userClubId';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                userClubId: {type: 'string'},
                userId: {type: 'string'},
                clubId: {type: 'string'},
                registrationDate: {type: 'string'},
                experience: {type: 'string'},
            }
        };
    }
    static get relationMappings() {
        const Club = require('./club');

        return {
            club: {
                relation: Model.HasOneRelation,
                modelClass: Club,
                join: {
                    from: 'userClub.clubId',
                    to: 'club.clubId'
                }
            },
        }
    }
}

module.exports = UserClub
