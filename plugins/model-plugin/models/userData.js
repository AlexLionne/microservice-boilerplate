const {Model} = require('objection');

const guid = require('objection-guid')({
    field: 'userDataId',
});

class UserData extends guid(Model) {

    static get tableName() {
        return 'userData';
    }

    static get idColumn() {
        return 'userDataId';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                userDataId: {type: 'string'},
                userId: {type: 'string'},
                firstName: {type: 'string'},
                lastName: {type: 'string'},
                birthDate: {type: 'string', format: 'date'},
                gender: {type: 'string'},
                weight: {type: 'string'},
                tall: {type: 'string'},
                experience: {type: 'long'},
                lastWorkoutDate: {type: 'string', format: 'date'},
                workoutsCount: {type: 'int'},
                avatarProperties: {type: 'string'},
                level: {type: 'int'},
                seriesCount: {type: 'int'},
                nesgaPassLicenseKey: {type: 'string'},
            }
        };
    }
}

module.exports = UserData
