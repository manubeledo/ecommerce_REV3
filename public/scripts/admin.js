console.log("DESDE EL SCRIPT CARRITO")
const templateCarrito = document.getElementById('template-carrito').content
const items = document.getElementById('items')
const nombre = document.getElementById('id-carrito')
const fragment = document.createDocumentFragment()

document.addEventListener('DOMContentLoaded', () => { fetchData() });

// Brings all data 
const fetchData = async () => {
    try{
        console.log("desde el fetch")
        const res = await fetch('/api/carritos')
        const datos = await res.json()
        console.log(datos)
        const resProd = await fetch('/api/productos')
        const product = await resProd.json()
        for (let j in datos){
            for (let i in product){
                if (datos[j].id_producto === product[i].id_productos){
                    datos[j].description = product[i].name
                }
            }
        }
        pintarCarrito(datos);
        pintarProductos(product);
    } catch(err) {
        console.log(err)
    }
}
// With data makes the cards of carritos
const pintarCarrito = (datos) => {
    items.innerHTML = '';
        datos.forEach(carrito => {
        templateCarrito.querySelector('th').textContent = carrito.id_carrito
        templateCarrito.querySelectorAll('td')[0].textContent = carrito.id_producto
        templateCarrito.querySelectorAll('td')[1].textContent = carrito.cantidad
        templateCarrito.querySelectorAll('td')[2].textContent = carrito.description
        templateCarrito.querySelectorAll('td')[3].textContent = 'VACIO'
        templateCarrito.querySelectorAll('td')[4].textContent = 'VACIO'

        // templateCarrito.querySelector('.btn-info').dataset.id = carrito.id
        templateCarrito.querySelector('.btn-danger').dataset.id = carrito.id_carrito

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)
}
// With data makes the cards of products
const pintarProductos = (datos) => {
    console.log(datos)
    products.innerHTML = '';
        datos.forEach(producto => {
        templateProducto.querySelectorAll('td')[0].textContent = producto.id_productos
        templateProducto.querySelectorAll('td')[1].textContent = producto.name
        templateProducto.querySelectorAll('td')[2].textContent = producto.description
        templateProducto.querySelectorAll('td')[3].textContent = producto.price
        templateProducto.querySelectorAll('td')[4].textContent = producto.thumbnail
        templateProducto.querySelectorAll('td')[5].textContent = producto.stock

        // templateProducto.querySelector('.btn-info').dataset.id = producto.id
        templateProducto.querySelector('.btn-danger').dataset.id = producto.id_producto

        const clone = templateProducto.cloneNode(true)
        fragment.appendChild(clone)
    })
    products.appendChild(fragment)
}
// Captures the event click
items.addEventListener('click', e => {
    btnAccion(e)
})

const btnAccion = async (e) => {
    if (e.target.classList.contains('btn-danger')) {
        await fetch(`/api/carritos/${e.target.dataset.id}`, {
            method: 'DELETE',
            headers:{ 'Content-Type': 'application/json' }
        })
        window.location.href = window.location.href
    }
    e.stopPropagation()
}