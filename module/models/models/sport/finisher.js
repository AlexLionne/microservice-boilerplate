const {Model} = require('objection')
const {config} = require("../../config/knex");
const guid = require('objection-guid')({
    field: 'id',
});


Model.knex(config)

class Finisher extends guid(Model) {
    static get tableName() {
        return 'sport.finisher';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: {type: 'string'},
                level: {type: 'int'},
                name: {type: 'string'},
                description: {type: 'string'},
                experience: {type: 'int'},
                repetition: {type: 'int'},
                repetitionType: {type: 'string'},
                betweenSleepTime: {type: 'int'},
            }
        };
    }

    static get relationMappings() {
        const FinisherTask = require('./finisherTask');

        return {
            tasks: {
                relation: Model.HasManyRelation,
                modelClass: FinisherTask,
                join: {
                    from: 'finisher.finisherId',
                    to: 'finisherTask.finisherId'
                }
            }
        }
    }

}

module.exports = Finisher
