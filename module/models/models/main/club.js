const {Model} = require('objection');
const {config} = require("../../config/knex");

const guid = require('objection-guid')({
    field: 'id',
});


Model.knex(config)

class Club extends guid(Model) {

    static get tableName() {
        return 'main.club';
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
                owner: {type: 'string'},
                experience: {type: 'string'},
            }
        };
    }
}

module.exports = Club
