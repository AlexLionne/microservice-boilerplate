const {Model} = require('objection')
const guid = require('objection-guid')({
    field: 'seasonWorkoutId',
});


class SeasonWorkout extends guid(Model) {
    static get tableName() {
        return 'seasonWorkout';
    }

    static get idColumn() {
        return 'seasonWorkoutId';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                seasonId: {type: 'string'},
                seasonWorkoutId: {type: 'string'},
                workoutId: {type: 'string'},
                level: {type: 'int'},
            }
        };
    }

    static get relationMappings() {
        const Workout = require('./workout');

        return {
            workout: {
                relation: Model.HasOneRelation,
                modelClass: Workout,
                join: {
                    from: 'workout.workoutId',
                    to: 'seasonWorkout.workoutId'
                }
            },
        }
    }


}

module.exports = SeasonWorkout
