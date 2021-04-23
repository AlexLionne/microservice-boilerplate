const passport = require('passport');
const LocalStrategy = require("passport-local");
const {Auth, User, UserData} = require('../../plugins/model-plugin/models')

passport.use('local', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    async function (email, password, done) {
        const auth = await Auth
            .query()
            .where('email', email).first()

        if (!auth) return done(null, false, {message: 'Unknown user'})

        const result = await auth.verifyPassword(password)

        if (result) {
            done(null, auth)
        }

        done(null, false)
    }
))

passport.serializeUser(function (auth, done) {
    done(null, auth.id)
})

passport.deserializeUser(async function (id, done) {
    const auth = await Auth
        .query()
        .where('authId', '=', id).first()

    done(null, auth)
})


module.exports = passport
