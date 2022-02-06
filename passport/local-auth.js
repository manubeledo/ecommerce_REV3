let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
const { User : db } = require('../config/db')

passport.use(new LocalStrategy(async (username, password, done) =>{
    let userData = await db.findOne({username : username}) // the second username comes as a param from routes
    console.log(`console log de user respuesta :${userData}`)
    if(password == userData.password)
    return done(null, { id: userData._id, name: userData.username});
    done(null, false);
}))

passport.serializeUser(function(user, done){
    console.log(`Desde serializeUser: ${user}`)
    done(null, user.id);
});
// no entiendo exactamente para que funciona, investigar!
passport.deserializeUser(async (id, done) => {
    done(null, { id: 1, name: 'ADMIN'});
})