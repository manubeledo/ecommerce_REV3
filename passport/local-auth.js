let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')
const { User : db } = require('../config/db')
const logger = require('../utils/logger')

function createHash(userpass){
    return bcrypt.hash(userpass, 10, null)
}

function validPassword(user, userpass){
    return bcrypt.compareSync(userpass, user.userpass)
}

passport.use('signup', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'username',
    passwordField: 'userpass'
}, async (req, username, userpass, done) =>{
    
    try{ 
        let userData = await db.findOne({username : username}) // the second username comes as a param from routes
        
        if(userData) {
            logger.getLogger('outwarning').warn(`El usuario ya existe!`)
            return done(null, false)
        }  else {
            let object = req.body
            object.userpass = await createHash(userpass)
            await db.create(object)
            let userData = await db.findOne({username : username})
            return done(null, userData) 
        }
    } 
    catch (err) {
        logger.getLogger('outerror').error('error al guardar el item ', err) 
    }
}))

passport.use('login', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'username',
    passwordField: 'userpass'
    }, async (req, username, userpass, done) =>{
       try{ 
        let userData = await db.findOne({username : username}) // the second username comes as a param from routes
        if(!validPassword(userData, userpass)){
            logger.getLogger('outwarning').warn('Invalid password')
            return done(null, false)
        }else{
            return done(null, userData)
        };
        } catch (err) {
            console.log(err)
        }
}))

const checkForAuth = (req, res, next) =>{
    if(req.isAuthenticated()){
        next()
    } else {
    res.redirect('/api/login')
    }
}


passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser((id, done) => {
    db.find({_id: id}, (err, user) => {
    done(null, user)
})
})

module.exports = checkForAuth;
