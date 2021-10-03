const {Model} = require('objection');

const guid = require('objection-guid')({
    field: 'userTokenId',
});

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
                token: {type: 'string'}
            }
        }
    }

    /**
     * return user or end the request
     * @param req
     * @param res
     * @param trx
     * @returns {Promise<*>}
     */

    static async handleToken(req, res, trx) {
        try {
            const token = this.getTokenFromHeaders(req)

            if (!token)
                return false

            const user = await this.query(trx).where('token', '=', token).first();


            return user?.userId
        } catch (e) {
            res.status(500).send()
            console.log(e)
        }
    }

    static getTokenFromHeaders = (req) => {
        const {headers: {authorization}} = req;

        if (authorization && authorization.split(' ')[0] === 'Bearer') {
            return authorization.split(' ')[1];
        }
        return null;
    }
}


module.exports = Token
