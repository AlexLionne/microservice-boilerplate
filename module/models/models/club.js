const {Model} = require('objection');
const {config} = require("../config/knex");

const guid = require('objection-guid')({
    field: 'clubId',
});


Model.knex(config)

class Club extends guid(Model) {

    static get tableName() {
        return 'club';
    }

    static get idColumn() {
        return 'clubId';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                clubId: {type: 'string'},
                name: {type: 'string'},
                description: {type: 'string'},
                experience: {type: 'int'},
                level: {type: 'int'},
                creationDate: {type: 'string'},
            }
        };
    }
}

module.exports = Club
