const {Model} = require('objection');
const {config} = require("../config/knex");
const jwt = require('jsonwebtoken');
const User = require("./user");
const fs = require("fs");
const path = require("path");

const guid = require('objection-guid')({
    field: 'userTokenId',
});
const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnipQBs5Zik7WX6gwXoIc
RcW6JUo42g60vpD9OYkWa/hKL4fIfXdvgwLb4PpM4qiAnzBkN7SN1nDwy8nzl/nB
bbwFR32xAP+5jW5tbZ9lFvWivkwrdk327ePisjAz6bup36ZYUwgXWifto/WobMQ2
vTd+VPVnt+tA4wqq7++uZ47W4aGQtCeKNa5It3jKyhdsB5GFvFzEKUnlxUZGTbx4
aYyRKffg4J2/McXumjSOOt9DLqxJee1vnqPNxZtqrug9sC+0L0iMQelgTVUUfxwT
z/m9+T7R1oYYq6Xt1U8DQnpu5/bxb8Wti7NVqX6bDjjkND5mOB4NyzaHULqahzWj
nwIDAQAB
-----END PUBLIC KEY-----`

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
                jwt.verify(token, publicKey, {algorithms: ['RS256']}, async function (err, decoded) {
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
