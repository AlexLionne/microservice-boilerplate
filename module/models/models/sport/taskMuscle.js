const {Model} = require('objection')
const guid = require('objection-guid')({
    field: 'id',
});
const {config} = require("../../config/knex");

Model.knex(config)

class TaskMuscle extends guid(Model) {
    static get tableName() {
        return 'sport.taskMuscle';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: {type: 'string'},
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
                    to: 'task.id'
                }
            },
            muscle: {
                relation: Model.HasOneRelation,
                modelClass: Muscle,
                join: {
                    from: 'taskMuscle.muscleId',
                    to: 'muscle.id'
                }
            },
        }
    }
}

module.exports = TaskMuscle
