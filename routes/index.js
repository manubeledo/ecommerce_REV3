let passport = require('passport');
const { Router } = require("express");
const router = Router();
const multer = require('multer')
const mimeTypes = require('mime-types')
const checkForAuth = require('../passport/local-auth')
const { User : db } = require('../config/db')
const { newuserEmail } = require('../services/sendEmail')


const storage = multer.diskStorage({
    destination: 'public/uploads',
    filename: async function(req, file, cb, next){
        console.log(`desde multer ${req.body.username}`)
        let userData = await db.findOne({username : req.body.username})
        console.log(userData)
        if (!userData) cb("", Date.now() + req.body.username + "." + mimeTypes.extension(file.mimetype));
        cb("", "return")
    }
})

const upload = multer({
    storage: storage
})

controllersProductos = require('../controllers MongoDb/controllers.productos')
controllersCarritos = require('../controllers MongoDb/controllers.carritos')
controllersAvatar = require('../controllers MongoDb/controllers.avatar')

function serverRouter(app){
    
    app.use('/api', router);
    
    router.get('/index', comesFromSignup ,(req, res) => res.render('index'))
    router.post('/productos', controllersProductos.write)
    router.get('/productos', controllersProductos.read)
    router.put('/updateproductos', controllersProductos.update)
    router.delete('/deleteproductos', controllersProductos.deleted)
    router.post('/producto/:id', controllersProductos.deleteProduct)

    router.post('/buy', checkForAuth, controllersCarritos.write)

    router.post('/carritos', controllersCarritos.write)
    router.get('/carritos', controllersCarritos.read)
    router.delete('/carritos/:id', controllersCarritos.deleted)

    router.get('/avatares', controllersAvatar.avatar)

    // Me trae todos los productos por id por GET en un JSON //
    router.get('/productos/:id', (req, res) => {
        async function getById() {
            try {
                let id = req.params.id;
                let datos = JSON.parse(await fs.promises.readFile('./public/database/productos.txt'));
                let responseFilter = datos.filter(elemento => elemento.id==id);
                if (responseFilter.length != 0){
                res.json(responseFilter);
                } else {
                    let object = {
                        error: -2,
                        descripcion: `ruta '/${req.params.id}' por metodo ${req.method} no implementada`
                    }
                    res.send(object)
                }
            }
            catch (err) {
                    console.log(err);
                }
            }
        getById()
    })

    router.get('/loadproduct', (req, res, next) => {
        if (req.isAuthenticated()) return next();
        res.redirect('login');
    }, (req, res) => {res.render('loadproduct');
    });

    // Carga la ruta carrito (SOLO PARA ADMIN) // 
    router.get('/carrito', (req, res, next) => {
        if (req.isAuthenticated()) return next();
        res.redirect('login');
    }, (req, res) => {res.render('carrito');
    })
    // Carga la ruta index //
    router.get('/index', (req, res) => {
        res.render('index');
    });

    // Carga la ruta login //
    router.get('/signup', (req, res) => {
        res.render('signup');
    });

    // router.post('/signup', upload.single('userpic'), controllersAuthenticate.newUser);

    router.post('/signup', upload.single('userpic'),  passport.authenticate('signup',{
        successRedirect: "index",
        failureRedirect: "login"
    }));

    router.get('/login', (req, res) => {
        res.render('login');
    });

    // Internally passport recieves req.body and use username and password from it
    // As default passport recieves 'local' but it can be set with other name, must be the
    // same in the first argument of LocalStragegy
    router.post('/login', passport.authenticate('login',{
        successRedirect: "/api/loadproduct",
        failureRedirect: "login"
    }));

    router.get('/logout', (req, res) => {
        res.redirect('login');
    })

    router.get('/:params', (req, res) => {
        let object = {
            error: -2,
            descripcion: `ruta '/${req.params.params}' por metodo ${req.method} no implementada`
        }
        res.send(object)
    });

    function comesFromSignup(req, res, next){

        console.log('esto es req.route' , req.header('referer'))
        if(req.header('referer') == `http://localhost:${process.env.PORT}/api/signup`){
            console.log(req.user)
            newuserEmail(req.user)
            next()
        } else{
           
            next()
        }
    }

}
module.exports = serverRouter;