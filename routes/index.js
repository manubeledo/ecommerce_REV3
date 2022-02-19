let passport = require('passport');
const { Router } = require("express");
const router = Router();
const checkForAuth = require('../passport/local-auth')
const { newuserEmail } = require('../services/sendEmail')
const upload = require('../http/middlewares/multer')
const logger = require('../utils/logger')


controllersProductos = require('../http/controllers.productos')
controllersCarritos = require('../http/controllers.carritos')
controllersAvatar = require('../http/controllers.avatar')

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
        successRedirect: "/api/index",
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
        logger.getLogger('warningFile').warn(`Try to access non existing route ${req.method} - ${req.url}`);
        res.send(object)
    });

    function comesFromSignup(req, res, next){
        if(req.header('referer') == `http://localhost:${process.env.PORT}/api/signup`){
            logger.getLogger('consola').info(req.user)
            newuserEmail(req.user)
            next()
        } else{
            next()
        }
    }
}
module.exports = serverRouter;