const {Model} = require('objection');
const {config} = require("../config/knex");

const guid = require('objection-guid')({
    field: 'id',
});


Model.knex(config)


class Device extends guid(Model) {

    static get tableName() {
        return 'user.device';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                deviceId: {type: 'string'},
                userId: {type: 'string'},
                firstConnectionDate: {type: 'string'},
                lastConnectionDate: {type: 'string'},
                timezone: {type: 'string'},
                FCMToken: {type: 'string'},
                info: {type: 'string'},
            }
        };
    }
}

module.exports = Device
