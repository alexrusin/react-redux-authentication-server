import passport from 'passport'
import User from '../models/user'
import passportJwt from 'passport-jwt'

const JwtStrategy = passportJwt.Strategy
const ExtractJwt = passportJwt.ExtractJwt