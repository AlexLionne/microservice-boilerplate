const {Model} = require('objection')
const {config} = require("../../config/knex");
const guid = require('objection-guid')({
    field: 'id',
});


Model.knex(config)

class Season extends guid(Model) {
    static get tableName() {
        return 'season';
    }

    static get idColumn() {
        return 'seasonId';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: {type: 'string'},
                name: {type: 'string'},
                description: {type: 'string'},
                active: {type: 'int'},
                startDate: {type: 'string'},
                enDate: {type: 'string'},
                version: {type: 'int'},
                seasonId: {type: 'string'},
            }
        };
    }

    static get relationMappings() {
        const SeasonWorkout = require('../sport/seasonWorkout');

        return {
            workouts: {
                relation: Model.HasManyRelation,
                modelClass: SeasonWorkout,
                join: {
                    from: 'season.seasonId',
                    to: 'seasonWorkout.seasonId'
                }
            },
        }
    }
}

module.exports = Season
