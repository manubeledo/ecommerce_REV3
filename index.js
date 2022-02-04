let fs = require('fs');
let express = require('express');
let passport = require('passport');
let cookieParser = require('cookie-parser');
let session = require('express-session');
let PassportLocal = require('passport-local').Strategy;
let path = require('path');
let cors = require('cors')
const serverRoutes = require("./routes");
let PORT = 5000;
let app = express();

app.use("/", express.static(path.join(__dirname,"public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors('*'));
app.use(cookieParser('un secreto'));
app.use(session ({
    secret: 'un secreto',
    resave: true,
    saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new PassportLocal(function(username, password, done){
    if(username === "admin" && password == "1234")
    return done(null, { id: 1, name: "ADMIN"});
    done(null, false);
}))

// 1 => Serializacion
passport.serializeUser(function(user, done){
    done(null, user.id);
});

// 2 => Deserializacion
passport.deserializeUser(function(id, done){
    done(null, { id: 1, name: "ADMIN"});
})

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, 'views'));

app.get('/', (req, res) => res.render('index'))

app.get('/:params', (req, res) => {
        let object = {
            error: -2,
            descripcion: `Ruta '/${req.params.params}' por metodo ${req.method} no implementada`
            }
            res.send(object)
});

serverRoutes(app);

app.listen(PORT, () => {
    console.log(`Server funcionando en http://localhost:${PORT}`);
})