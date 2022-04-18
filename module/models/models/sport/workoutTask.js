const {Model} = require('objection')
const knex = require('knex')
const {config} = require("../../config/knex");
const guid = require('objection-guid')({
    field: 'id',
});


Model.knex(config)

class WorkoutTask extends guid(Model) {
    static get tableName() {
        return 'sport.workoutTask';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: {type: 'string'},
                workoutId: {type: 'string'},
                taskId: {type: 'string'},
                repetition: {type: 'int'},
                repetitionType: {type: 'string'},
                order: {type: 'int'},
            }
        };
    }

    static get relationMappings() {
        const Task = require('./task');

        return {
            task: {
                relation: Model.HasOneRelation,
                modelClass: Task,
                join: {
                    from: 'task.id',
                    to: 'workoutTask.taskId'
                }
            }
        }
    }
}

module.exports = WorkoutTask
