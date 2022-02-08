let passport = require('passport');
const { Router } = require("express");
const { render } = require('express/lib/response');
const router = Router(); 
const {newuserEmail} = require('../services/sendEmail')


controllersProductos = require('../controllers MongoDb/controllers.productos')
controllersCarritos = require('../controllers MongoDb/controllers.carritos')

let host = ''

if(process.env.NODE_ENV === 'development') host = 'http://localhost:5000'

function serverRouter(app){
    
    app.use('/api', router);
    
    router.get('/index', (req, res) => res.render('index'))
    router.post('/productos', controllersProductos.write)
    router.get('/productos', controllersProductos.read)
    router.put('/updateproductos', controllersProductos.update)
    router.delete('/deleteproductos', controllersProductos.deleted)
    router.post('/producto/:id', controllersProductos.deleteProduct)

    router.post('/carritos', controllersCarritos.write)
    router.get('/carritos', controllersCarritos.read)
    router.delete('/carritos/:id', controllersCarritos.deleted)

    router.get('/newuser', newuserEmail) // CAMBIAR POR POST

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
    router.get('/login', (req, res) => {
        res.render('login');
    });

    // Recibe credenciales e inicia sesion //
    router.post('/login', passport.authenticate('local',{
        successRedirect: "/api/loadproduct",
        failureRedirect: "login"
    }));

    // Envia error si la ruta es inexistente //
    router.get('/:params', (req, res) => {
        let object = {
            error: -2,
            descripcion: `ruta '/${req.params.params}' por metodo ${req.method} no implementada`
        }
        res.send(object)
    });

}
module.exports = serverRouter;