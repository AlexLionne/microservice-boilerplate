const passport = require('passport');
const LocalStrategy = require('passport-local');
const Auth = require("../../plugins/model-plugin/models/auth");


passport.use(new LocalStrategy({
    usernameField: 'auth[email]',
    passwordField: 'auth[password]',
}, async (email, password, done) => {


    try{
        const auth = await Auth.query()
            .select('email')
            .where('email', '=', email)

        if(!auth || !auth.validatePassword(password)) {
            //Email or Password is Invalid
            return done(null, false, { error: 'EOPI'  });
        }

        return done(null, auth);
    } catch (e) {
        done()
    }


}));
