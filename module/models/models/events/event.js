const {Model} = require('objection')
const guid = require('objection-guid')({
    field: 'id',
});
const {config} = require("../../config/knex");

Model.knex(config)

class Event extends guid(Model) {
    static get tableName() {
        return 'events.event';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: {type: 'string'},
                createdAt: {type: 'timestamp'},
                action: {type: 'string'},
                resource: {type: 'string'},
                source: {type: 'string'},
            }
        };
    }
}

module.exports = Event
