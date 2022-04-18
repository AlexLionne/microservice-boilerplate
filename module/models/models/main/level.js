const {Model} = require('objection')
const knex = require('knex')
const {config} = require("../../config/knex");
const guid = require('objection-guid')({
    field: 'id',
});

Model.knex(config)

class Level extends guid(Model) {
    static get tableName() {
        return 'main.level';
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
                experience: {type: 'int'},
                nextExperience: {type: 'int'}
            }
        };
    }
}

module.exports = Level
