const {Activation} = require("./index");


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
                name: {type: 'string'},
                duration: {type: 'int'},
                level: {type: 'int'},
                description: {type: 'int'},
                awakingId: {type: 'string'},
                warmumpId: {type: 'string'},
                experience: {type: 'int'},
            }
        };
    }

    async $afterFind() {

        this.activation = {}
        // add a random activation to workout
        const activations = await Activation.query()

        if (Array.from(activations).length > 0) {
            this.activation = activations[Math.floor(Math.random() * Array.from(activations).length)]

        }
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
