const {Model} = require('objection');
const {config} = require("../config/knex");
const jwt = require('jsonwebtoken');
const User = require("./user");

const guid = require('objection-guid')({
    field: 'userTokenId',
});


Model.knex(config)

class Token extends guid(Model) {

    static get tableName() {
        return 'userToken';
    }

    static get idColumn() {
        return 'userTokenId';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            properties: {
                userTokenId: {type: 'string', maxLength: 36},
                userId: {type: 'string', maxLength: 36},
                token: {type: 'string'},
                refreshToken: {type: 'string'},
            }
        }
    }

    /**
     * return user or end the request
     * @param req
     * @param res
     * @returns {Promise<*>}
     */

    static async handleToken(req, res) {
        try {
            const token = this.getTokenFromHeaders(req)

            if (!token)
                return false

            const {authId} = jwt.verify(token, '6716778962');

            if (!authId)
                return false

            const {userId} = await User.query().where('authId', '=', authId).first()

            return userId
        } catch (e) {
            console.log(e)
            res.status(500).send()
        }
    }

    static getTokenFromHeaders(req) {
        const {headers: {authorization}} = req;

        if (authorization && authorization.split(' ')[0] === 'Bearer') {
            return authorization.split(' ')[1];
        }
        return null;
    }
}


module.exports = Token
