const {Model} = require('objection')
const guid = require('objection-guid')({
    field: 'taskMuscleId',
});
const {config} = require("../config/knex");
const Accessory = require("./accessory");

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
                effort: {type: 'float'},
                recovery: {type: 'time'},
            }
        };
    }

    static get relationMappings() {
        const Muscle = require('./muscle');
        const Accessory = require('./accessory');

        return {
            accessory: {
                relation: Model.HasOneRelation,
                modelClass: Accessory,
                join: {
                    from: 'task.accessoryId',
                    to: 'accessory.accessoryId'
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
