const { Model } = require('objection')
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const guid = require('objection-guid')({
  field: 'authId',
});

class Auth extends guid(Model) {
  static get tableName() {
    return 'auth';
  }

  static get idColumn() {
    return 'taskId';
  }

  static get jsonSchema () {
    return {
      type: 'object',
      properties: {
        authId: {type: 'string', maxLength: 36},
        email: {type: 'string', maxLength: 36},
        hash: {type: 'string'},
        salt: {type: 'string'},
      }
    };
  }
   setPassword (password){
    console.log(password)
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  };

   verifyPassword (password, callback) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
  };

   static generateJWT = function() {
    const today = new Date();
    const expirationDate = new Date(today);
    expirationDate.setDate(today.getDate() + 60);

    return jwt.sign({
      email: this.email,
      id: this._id,
      exp: parseInt(expirationDate.getTime() / 1000, 10),
    }, 'secret');
  }

   toAuthJSON () {
    return {
      _id: this._id,
      email: this.email,
      token: this.generateJWT(),
    };
  };

}

module.exports = Auth
