const {Model} = require('objection')
const {config} = require("../../config/knex");
const guid = require('objection-guid')({
    field: 'id',
});


Model.knex(config)

class Activation extends guid(Model) {
    static get tableName() {
        return 'sport.activation';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: {type: 'string'},
                name: {type: 'string'},
                description: {type: 'string'},
                experience: {type: 'int', value: 15}
            }
        };
    }

    static get relationMappings() {
        const ActivationTask = require('./activationTask');

        return {
            tasks: {
                relation: Model.HasManyRelation,
                modelClass: ActivationTask,
                join: {
                    from: 'activation.activationId',
                    to: 'activationTask.activationId'
                }
            },
        }
    }
}

module.exports = Activation
