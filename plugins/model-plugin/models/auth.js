const {Model} = require('objection')
const jwt = require('jsonwebtoken');

const bcrypt = require("bcryptjs");
const {config} = require("../config/knex");
const fs = require("fs");
const path = require("path");
const guid = require('objection-guid')({
    field: 'authId',
});

const privateKey = fs.readFileSync(path.join(process.mainModule.filename, '../config/private.pem'));
const RECOMMENDED_ROUNDS = 12
const BCRYPT_HASH_REGEX = /^\$2[ayb]\$[0-9]{2}\$[A-Za-z0-9./]{53}$/


const options = {
    allowEmptyPassword: false,
    passwordField: 'password',
    rounds: RECOMMENDED_ROUNDS,
}


Model.knex(config)

class Auth extends guid(Model) {

    static get tableName() {
        return 'auth';
    }

    static get idColumn() {
        return 'authId';
    }

    async $beforeInsert(...args) {
        await super.$beforeInsert(...args)

        return await this.generateHash()
    }

    async $beforeUpdate(queryOptions, ...args) {
        await super.$beforeUpdate(queryOptions, ...args)

        if (queryOptions.patch && this[options.passwordField] === undefined) {
            return
        }

        return await this.generateHash()
    }

    // Compares a password to a bcrypt hash, returns whether or not the password was verified.
    async verifyPassword(password) {
        return await bcrypt.compare(password, this[options.passwordField])
    }

    /* Sets the password field to a bcrypt hash of the password.
     * Only does so if the password is not already a bcrypt hash. */
    async generateHash() {
        const password = this[options.passwordField]

        if (password) {
            if (this.constructor.isBcryptHash(password)) {
                throw new Error('bcrypt tried to hash another bcrypt hash')
            }

            const hash = await bcrypt.hash(password, options.rounds)
            this[options.passwordField] = hash

            return hash
        }

        // Throw an error if empty passwords are not allowed.
        if (!options.allowEmptyPassword) {
            throw new Error('password must not be empty')
        }
    }

    /* Detect rehashing to avoid undesired effects.
     * Returns true if the string seems to be a bcrypt hash. */
    static isBcryptHash(str) {
        return BCRYPT_HASH_REGEX.test(str)
    }

    generateJWT() {
        return jwt.sign(
            {
                aud: 'https://api.nesga.fr',
                iss: 'https://dev.nesga.fr',
                sub: this.authId,
                authId: this.authId,
            },
            privateKey,
            {algorithm: 'RS256'})
    }
}

module.exports = Auth
