const {Model} = require('objection');
const {config} = require("../config/knex");
const jwt = require('jsonwebtoken');
const User = require("./user");
const fs = require("fs");
const path = require("path");
const jwt_decode = require('jwt-decode')
const guid = require('objection-guid')({
    field: 'userTokenId',
});

const publicKey = fs.readFileSync(path.join(process.mainModule.filename, '../config/public.pem'));


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
     * @param next
     * @returns {Promise<*>}
     */

    static async handleToken(req, res) {
        try {
            const token = this.getTokenFromHeaders(req)

            console.log(token)
            if (!token)
                return false

            const {authId} = jwt_decode(token)

            console.log(jwt_decode(token))
            if (!authId)
                return false

            const {userId} = await User.query().where('authId', '=', authId).first()

            if (!userId)
                return false

            return userId

        } catch (e) {
            console.log(e)
            return false
        }
    }

    static getTokenFromHeaders(req) {
        const {headers} = req;

        console.log(req.headers)
        
        let authorization = headers.authorization

        if (headers['x-forwarded-authorization']) {
            authorization = headers['x-forwarded-authorization']
        }
        if (headers['X-Apigateway-Api-Userinfo']) {
            authorization = headers['X-Apigateway-Api-Userinfo']
        }

        if (authorization && authorization.split(' ')[0] === 'Bearer') {
            return authorization.split(' ')[1];
        }
        return null;
    }
}


module.exports = Token
