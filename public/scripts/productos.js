const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
sessionStorage.setItem('carrito', {})
let carrito = {}
let carritos = {}
let compra = {}
let index = 1;

document.addEventListener('DOMContentLoaded', async () => { await fetchData() });
document.addEventListener('DOMContentLoaded', () => { carritosData() });

cards.addEventListener('click', e => {
    addCarrito(e)
})

items.addEventListener('click', e => {
    btnAccion(e)
})

const fetchData = async () => {
    try{
        const res = await fetch('http://localhost:5000/api/productos');
        const data = await (res.json());
        console.log("FETCH DATA =>", data);
        pintarCards(data);
    } catch(err) {
        console.log("ERROR DESDE EL FETCH", err)
    }
}

// sessionStorage.setItem('carrito', JSON.stringify(carrito))
// sessionStorage.getItem('carrito')

const carritosData = async () => {
    try{
        if (sessionStorage.getItem('carrito') != ''){
            carrito = JSON.parse(sessionStorage.getItem('carrito'))
            pintarCarrito()
        }
    } catch(err) {
        console.log(err)
    }
}

// SE CREAN LAS CARDS //
const pintarCards = data => {
    data.forEach(producto => {
        templateCard.getElementById('card-name').textContent = producto.name
        templateCard.getElementById('card-description').textContent = producto.description
        templateCard.getElementById('card-price').textContent = producto.price
        templateCard.getElementById('card-stock').textContent = producto.stock
        templateCard.getElementById('card-img').src= producto.thumbnail
        templateCard.querySelector('.btn-dark').dataset.id = producto.id_producto

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

const addCarrito = e => {
    console.log(e.target);
    console.log(e.target.parentElement)
    // console.log(e.target.classList.contains('button'));
    if (e.target.classList.contains('button')) {
        createCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

// SE CREA EL CARRITO //

const createCarrito = async (objeto) => {
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('.header').textContent,
        precio: objeto.querySelector('.left').textContent,
        cantidad: 1,
        timestamp: Date.now(),
        codigo: ((Date.now)/100000),
        description: `una descripcion`,
        stock: 100
    }
    
    console.log(carrito)

    console.log(producto.id)

    if(carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }

    carrito[producto.id] = {...producto}

    sessionStorage.setItem('carrito', JSON.stringify(carrito))
    
    // await refreshCar()
    
    pintarCarrito()
}

// SE PINTA EL CARRITO //

const pintarCarrito = async () => {
    items.innerHTML = '';
    Object.values(carrito).forEach(producto => {
        console.log(templateCarrito)
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelectorAll('td')[2].textContent = producto.timestamp
        templateCarrito.querySelectorAll('td')[3].textContent = producto.description
        templateCarrito.querySelectorAll('td')[4].textContent = producto.stock
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
    // await refreshCar()
    pintarFooter()
}

// SE CREA EL FOOTER //

const pintarFooter = () => {
    footer.innerHTML = ''
    
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="8">Carrito vacío con innerHTML</th>
        `
        return
    }
    
    // SUMAR CANTIDAD Y SUMAR TOTALES
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)

    footer.appendChild(fragment)

    const boton = document.querySelector('#vaciar-carrito')
    boton.addEventListener('click', () => {
        carrito = {}
        refreshCar()
        pintarCarrito()
    })

    const buy = document.querySelector('#buy-carrito')
    
    buy.addEventListener('click', async () => {

        console.log('Compra del carrito')
        console.log(carrito)

        let id_carrito = Math.floor(Date.now()/1000)

        Object.values(carrito).forEach((producto, indice) => {
            compra[indice] = {id_carrito, id_producto: Number(producto.id), cantidad: producto.cantidad}
        })

        carrito = {}
        await buyCarritos()
        pintarCarrito()
    })
}

// SE CREA LA ACCION DE LOS BOTONES PARA AUMENTAR Y DISMINUIR CANTIDAD//

const btnAccion = e => {
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = { ...producto }
        sessionStorage.setItem('carrito', JSON.stringify(carrito))
        refreshCar()
        pintarCarrito()
    }

    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
            refreshCar()
        } else {
            carrito[e.target.dataset.id] = {...producto}
            refreshCar()
        }
        pintarCarrito()
    }
    e.stopPropagation()
}

async function buyCarritos(){
    await fetch("http://localhost:5000/api/carritos", {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(compra), // data can be `string` or {object}!
        headers:{ 'Content-Type': 'application/json' }
      })
    sessionStorage.setItem('carrito', JSON.stringify(carrito))
}

async function refreshCar(){
    await fetch("http://localhost:5000/api/carrito", {
        method: 'POST', // or 'PUT'
        body: JSON.stringify(carrito), // data can be `string` or {object}!
        headers:{ 'Content-Type': 'application/json' }
      })
    sessionStorage.setItem('carrito', JSON.stringify(carrito))
}