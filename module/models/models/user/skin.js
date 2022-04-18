const {Model} = require('objection')
const {config} = require("../config/knex");

const guid = require('objection-guid')({
    field: 'id',
});


Model.knex(config)

class Skin extends guid(Model) {
    static get tableName() {
        return 'user.skin';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: {type: 'string'},
                skinId: {type: 'string'},
                userId: {type: 'string'},
                acquiredAt: {type: 'timestamp'},
            }
        };
    }
}

module.exports = Skin
