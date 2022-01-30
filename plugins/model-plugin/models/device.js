const {Model} = require('objection');
const {config} = require("../config/knex");

const guid = require('objection-guid')({
    field: 'deviceId',
});


Model.knex(config)


class Device extends guid(Model) {

    static get tableName() {
        return 'device';
    }

    static get idColumn() {
        return 'deviceId';
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
