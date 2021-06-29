const {Model} = require('objection');

const guid = require('objection-guid')({
    field: 'userSeasonId',
});

class UserSeason extends guid(Model) {

    static get tableName() {
        return 'userSeason';
    }

    static get idColumn() {
        return 'userSeasonId';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                userSeasonId: {type: 'string'},
                seasonId: {type: 'string'},
                userId: {type: 'string'},
                completion: {type: 'float'},
                experience: {type: 'long'},
            }
        };
    }
}

module.exports = UserSeason
