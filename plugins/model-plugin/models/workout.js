
const {Model} = require('objection')

const guid = require('objection-guid')({
    field: 'workoutId',
});



class Workout extends guid(Model) {
    static get tableName() {
        return 'workout';
    }

    static get idColumn() {
        return 'workoutId';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                workoutId: {type: 'string'},
                finisherId: {type: ['string', 'null'], default: null},
                name: {type: 'string'},
                duration: {type: 'int'},
                level: {type: 'int'},
                description: {type: 'int'},
                experience: {type: 'int'},
            }
        };
    }


    static get relationMappings() {
        const WorkoutTask = require('./workoutTask');
        const Finisher = require('./finisher');

        return {
            tasks: {
                relation: Model.HasManyRelation,
                modelClass: WorkoutTask,
                join: {
                    from: 'workout.workoutId',
                    to: 'workoutTask.workoutId'
                }
            },
            finisher: {
                relation: Model.HasOneRelation,
                modelClass: Finisher,
                join: {
                    from: 'workout.finisherId',
                    to: 'finisher.finisherId'
                }
            },
        }
    }
}

module.exports = Workout
