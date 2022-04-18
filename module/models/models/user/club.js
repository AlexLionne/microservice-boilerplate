const {Model} = require('objection');
const {config} = require("../../config/knex");

const guid = require('objection-guid')({
    field: 'id',
});


Model.knex(config)


class Club extends guid(Model) {

    static get tableName() {
        return 'user.club';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: {type: 'string'},
                userId: {type: 'string'},
                registrationDate: {type: 'string'},

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

module.exports = Club
