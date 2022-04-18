const {Model} = require('objection');
const {config} = require("../../config/knex");

const guid = require('objection-guid')({
    field: 'id',
});

Model.knex(config)

class Season extends guid(Model) {

    static get tableName() {
        return 'user.season';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: {type: 'string'},
                seasonId: {type: 'string'},
                userId: {type: 'string'},
                completion: {type: 'float'},
                experience: {type: 'long'},
            }
        };
    }
}

module.exports = Season
