const {Model} = require('objection');
const {config} = require("../../config/knex");

const guid = require('objection-guid')({
    field: 'id',
});


Model.knex(config)

class User extends guid(Model) {

    static get tableName() {
        return 'user.information';
    }

    static get idColumn() {
        return 'id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                id: {type: 'string'},
                createdAt: {type: 'string'},
                email: {type: 'string'},
                username: {type: 'string'}
            }
        };
    }

    static get relationMappings() {
        const Club = require('../user/club');
        const Device = require('../user/device');
        const Information = require('../user/information');

        return {
            club: {
                relation: Model.HasOneRelation,
                modelClass: Club,
                join: {
                    from: 'user.userId',
                    to: 'userClub.userId'
                }
            },
            data: {
                relation: Model.HasOneRelation,
                modelClass: Information,
                join: {
                    from: 'user.userId',
                    to: 'userData.userId'
                }
            },
            device: {
                relation: Model.HasManyRelation,
                modelClass: Device,
                join: {
                    from: 'user.userId',
                    to: 'device.userId'
                }
            },
        }
    }
}

module.exports = User
