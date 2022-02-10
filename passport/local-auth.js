let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')
const { User : db } = require('../config/db')

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
    console.log(`Desde passport signup`)
    try{ 
        let userData = await db.findOne({username : username}) // the second username comes as a param from routes
        // console.log(`DESDE PASSPORT signup ${userData}`)
        if(userData) {
            console.log(`El usuario ya existe!`)
            return done(null, false)
        }  else {
            let object = req.body
            object.userpass = await createHash(userpass)
            await db.create(object)
            console.log('usuario creado con exito!')
            return done(null, userData) 
        }
    } 
    catch (err) {
        console.log('error al guardar el item ', err) 
    }
}))

passport.use('login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'userpass'
    }, async (username, userpass, done) =>{
        let userData = await db.findOne({username : username}) // the second username comes as a param from routes
        console.log(`console log de user respuesta :${userData}`)
        if(!validPassword(userData, userpass)){
            console.log('Invalid password')
            return done(null, false)
        }else{
            done(null, userData)
        };
}))

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser((id, done) => {
    db.find({_id: id}, (err, user) => {
    done(err, user)
})
})