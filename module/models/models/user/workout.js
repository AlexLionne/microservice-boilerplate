const {Model} = require('objection')
const {config} = require("../../config/knex");
const guid = require('objection-guid')({
    field: 'id',
});


Model.knex(config)

class Workout extends guid(Model) {
    static get tableName() {
        return 'user.workout';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: {type: 'string'},
                seasonWorkoutId: {type: 'string'},
                userId: {type: 'string'},
                endTime: {type: 'time'},
                averageCaloriesBurned: {type: 'long'},
                completionDate: {type: 'datetime'},
            }
        };
    }
}

module.exports = Workout
