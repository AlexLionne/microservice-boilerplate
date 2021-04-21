const passport = require('passport');
const LocalStrategy = require('passport-local');
const {Auth} = require("../../plugins/model-plugin/models");

require('../passport/passport');

passport.use('local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',

}, async (email, password, done) => {

    try{
        const auth = await Auth.query()
            .select('email')
            .where('email', '=', email)

        const passwordValid = await auth.verifyPassword(password);

        if(!auth || !passwordValid) {
            //Email or Password is Invalid
            return done(null, false, { error: 'EOPI'  });
        }

        return done(null, auth);
    } catch (e) {
        done(null, false, { error: 'EOPI'  });
    }


}));
