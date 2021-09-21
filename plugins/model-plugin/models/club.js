const {Model} = require('objection');

const guid = require('objection-guid')({
    field: 'clubId',
});


class Club extends guid(Model) {

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
                clubId: {type: 'string'},
                name: {type: 'string'},
                description: {type: 'string'},
                experience: {type: 'int'},
                level: {type: 'int'},
                creationDate: {type: 'string'},
            }
        };
    }
}

module.exports = Club
