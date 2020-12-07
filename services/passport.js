import passport from 'passport'
import User from '../models/user'
import passportJwt from 'passport-jwt'
import LocalStrategy from 'passport-local'

const JwtStrategy = passportJwt.Strategy
const ExtractJwt = passportJwt.ExtractJwt

const localLogin = new LocalStrategy({
    usernameField: 'email',
}, async (email, password, done) => {
    try {
        await User.findByCredentials(email, password)
    } catch (err) {
        if (err.message === 'NotFound' || 'Unauthorized') {
            return done(null, false)
        }

        done(err)
    }
})

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.APP_SECRET
}

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    User.findById(payload.sub, (err, user) => {
        if (err) {
            return done(err, false)
        }

        if (user) {
            done(null, user)
        } else {
            done(null, false)
        }
    })
})

passport.use(jwtLogin)