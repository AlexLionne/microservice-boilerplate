const {Model} = require('objection')
const {config} = require("../../config/knex");
const guid = require('objection-guid')({
    field: 'id',
});


Model.knex(config)

class Feedback extends guid(Model) {
    static get tableName() {
        return 'user.feedback';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: {type: 'string'},
                userId: {type: 'string'},
                workoutId: {type: 'string'},
                feedback: {type: 'int'},
                createdAt: {type: 'timestamp'},

            }
        };
    }
}

module.exports = Feedback
