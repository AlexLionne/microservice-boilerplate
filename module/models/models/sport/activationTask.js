const {Model} = require('objection')
const {config} = require("../../config/knex");
const guid = require('objection-guid')({
    field: 'id',
});


Model.knex(config)

class ActivationTask extends guid(Model) {
    static get tableName() {
        return 'sport.activationTask';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: {type: 'string'},
                activationId: {type: 'string'},
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
                    from: 'task.taskId',
                    to: 'activationTask.taskId'
                }
            }
        }
    }

}

module.exports = ActivationTask
