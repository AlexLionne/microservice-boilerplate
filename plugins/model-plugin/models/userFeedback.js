const {Model} = require('objection')
const guid = require('objection-guid')({
    field: 'userFeedbackId',
});


class UserFeedback extends guid(Model) {
    static get tableName() {
        return 'userFeedback';
    }

    static get idColumn() {
        return 'userFeedbackId';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                userFeedbackId: {type: 'string'},
                userId: {type: 'string'},
                workoutId: {type: 'string'},
                feedbackDate: {type: 'datetime'},
                feedback: {type: 'int'},
            }
        };
    }
}

module.exports = UserFeedback
