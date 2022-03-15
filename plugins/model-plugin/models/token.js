const {Model} = require('objection');
const {config} = require("../config/knex");
const jwt = require('jsonwebtoken');
const User = require("./user");
const fs = require("fs");
const path = require("path");

const guid = require('objection-guid')({
    field: 'userTokenId',
});
//const publicKey = fs.readFileSync(path.join(process.mainModule.filename, '../config/public.pem'));

const SECRET_KEY = process.env.SECRET_KEY

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

            if (!token)
                return false

            return await new Promise((resolve) => {
                jwt.verify(token, SECRET_KEY, async function (err, decoded) {
                    if (err) {
                        console.error(err)
                        resolve(false)
                    }
                    console.log(decoded)
                    const authId = decoded.authId

                    if (!authId)
                        resolve(false)

                    const {userId} = await User.query().where('authId', '=', decoded.authId).first()

                    resolve(userId)
                });
            })

        } catch (e) {
            console.log(e)
            return false
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
