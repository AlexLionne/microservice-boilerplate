const {Model} = require('objection')
const guid = require('objection-guid')({
    field: 'taskMuscleId',
});
const {config} = require("../config/knex");

Model.knex(config)

class TaskMuscle extends guid(Model) {
    static get tableName() {
        return 'taskMuscle';
    }

    static get idColumn() {
        return 'taskMuscleId';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                taskMuscleId: {type: 'string'},
                muscleId: {type: 'string'},
                taskId: {type: 'string'},
                effort: {type: 'int'},
                recovery: {type: 'int'},
            }
        };
    }

    static get relationMappings() {
        const Muscle = require('./muscle');
        const Accessory = require('./accessory');

        return {
            task: {
                relation: Model.HasManyRelation,
                modelClass: Accessory,
                join: {
                    from: 'taskMuscle.taskId',
                    to: 'task.taskId'
                }
            },
            muscle: {
                relation: Model.HasOneRelation,
                modelClass: Muscle,
                join: {
                    from: 'taskMuscle.muscleId',
                    to: 'muscle.muscleId'
                }
            },
        }
    }
}

module.exports = TaskMuscle
