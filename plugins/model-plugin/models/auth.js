const {Model} = require('objection')
const jwt = require('jsonwebtoken');
const fs = require("fs")

const bcrypt = require("bcryptjs");
const {config} = require("../config/knex");
const path = require("path");
const guid = require('objection-guid')({
    field: 'authId',
});
const privateKey = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAnipQBs5Zik7WX6gwXoIcRcW6JUo42g60vpD9OYkWa/hKL4fI
fXdvgwLb4PpM4qiAnzBkN7SN1nDwy8nzl/nBbbwFR32xAP+5jW5tbZ9lFvWivkwr
dk327ePisjAz6bup36ZYUwgXWifto/WobMQ2vTd+VPVnt+tA4wqq7++uZ47W4aGQ
tCeKNa5It3jKyhdsB5GFvFzEKUnlxUZGTbx4aYyRKffg4J2/McXumjSOOt9DLqxJ
ee1vnqPNxZtqrug9sC+0L0iMQelgTVUUfxwTz/m9+T7R1oYYq6Xt1U8DQnpu5/bx
b8Wti7NVqX6bDjjkND5mOB4NyzaHULqahzWjnwIDAQABAoIBADQXuY3UTtdnyeFt
kqi977PnQLzhakIfj9YoCM73YMQk3cIz1YvFV5vtyB+cMNCCMQK9PHTAaerT/esQ
08MdRmDvCUoXksHCeAml8jKlyfS66GQG0FXBre+CG/sWNzLnVTbNIdAPHSnbdsCG
u3c/VMwTR++ReByyRgfBTrWB2o5Oj9hbd7RcJOlHkZRhRfXAUii1TkhsEplP9EJj
gXbCl8we6bmKXiCtiz+jaVyaUCeDPX4Xd5mce7/9QVwoJ+AgUpwCAJhk95POdf5b
DvBRgGZgM4eG1jbqTGlydjc9cp/YiE6xLEzApIHzumvsVagQgpXKmWW27699OHpL
1cHgeRkCgYEAykeA3SUcXn1iFVcQaV9Ymy60fYffHaYo22SmGNAG4lDNH97fClau
Bxr8VuekByLm5I0n8/NpL5M5166mHhf6e7/4akwkpWgFeEY/HYqaY5E6o7gYspIO
FcnzHA6zkLNjiSLZj9IthMFSVgbjBaI4Ca1eLLHepfMse3vKaPk8bh0CgYEAyCuZ
kRt0/sDX1Mf4xeg+2LXDjoMMPniRKLYjxGJApq4zQhW2syLLCWZNMS3CV8w0CaZC
7eowEykQZtCfK7vYysUrH/gRDnFa4JTrg5BXykSA3KgK7hYsO7fbjQzVtLL88iMr
4uQ1w9SWb4oMY9SDMDNX1NotdOKMY5QVZeWFm+sCgYAuiCxYswTHp8g8aH7Z/pj/
ecsDZZIp2+NiNNEQvCoZPcUyI67jTfVSpR6PT1IoYhsDUIV0VPZJf3C68O491f5F
IXAf48w6UKeRd3dlcFD7vpjiuKLV0Ut0L7TBK5CbJOksztuFfjACbgZmy8bFsP97
GmqjlXdGbZ45+cwiQdNo8QKBgDBJHC09w1YkrKu+ZUtQP8DE79xzzkNPkCyS60PX
M6NBiEnbtQu3S+UDkYFYeXX2Y2MkgSalBF3K3RMAJjVFhgE72LBIhczHGVXtdnZx
HkxDhBY2TxSpspfhPQvkWbTSLGQ4icCcrj+EC5nyYhS+0bqR2BEXZDm64ISw1wyS
dk1rAoGBAJBRz5GAsLhwyx/925KKW/yNsyahxmOArzlbVtYWVoV8CCdvDYpbrhvc
OU8Z1A2Rrk5WUaFA8ivKHr3BItR73AhXDNODTvPKXroK+WxMLvTLiVUGFk1odoPf
4ypQnYMfScD1Z2mWDo6VcZklyBe7P1ieNRwlCE+25Lc9kXxxLtib
-----END RSA PRIVATE KEY-----`

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
        if (!password) return true

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
    }

    /* Detect rehashing to avoid undesired effects.
     * Returns true if the string seems to be a bcrypt hash. */
    static isBcryptHash(str) {
        return BCRYPT_HASH_REGEX.test(str)
    }

    generateJWT() {
        const self = this

        return jwt.sign(
            {
                authId: self.authId,
            },
            privateKey,
            {algorithm: 'RS256'}
        );
    }
}

module.exports = Auth
