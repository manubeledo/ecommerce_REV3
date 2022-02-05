const templateProducto = document.getElementById('template-producto').content
const products = document.getElementById('products')
const fragment = document.createDocumentFragment()
const btnform = document.getElementById('btn-form')

document.addEventListener('DOMContentLoaded', () => { fetchData() });


const fetchData = async () => {
    try{
        console.log("desde el fetch")
        const resProd = await fetch('/api/productos')
        const product = await resProd.json()
        pintarProductos(product);
    } catch(err) {
        console.log(err)
    }
}

//Pass the data comming from database as "datos" and creates the visual table
const pintarProductos = (datos) => {
    products.innerHTML = '';
        datos.forEach(producto => {
        templateProducto.querySelectorAll('td')[0].textContent = producto.id_producto
        templateProducto.querySelectorAll('td')[1].textContent = producto.name
        templateProducto.querySelectorAll('td')[2].textContent = producto.description
        templateProducto.querySelectorAll('td')[3].textContent = producto.price
        templateProducto.querySelector('img').setAttribute('src', `${producto.thumbnail}`) 
        templateProducto.querySelectorAll('td')[5].textContent = producto.stock
        templateProducto.querySelector('.btn-danger').dataset.id = producto.id_producto
        const clone = templateProducto.cloneNode(true)
        fragment.appendChild(clone)
    })
    products.appendChild(fragment)
}

//Captures the event click in table with id=products
products.addEventListener('click', e => {
    btnAccion(e);
    // console.log(e)
})

//Save the id from the trash can button and call deleteProduct
function btnAccion (e) {
    if (e.target.classList.contains('trash-can'))
    deleteProduct(e.path[1].dataset.id)
    else if (e.target.classList.contains('btn-danger'))
    deleteProduct(e.path[0].dataset.id)
}

//Receive id from btnAccion and post in route to delete
const deleteProduct = async (id) => {
    console.log(id)
    let idnum = {
        "idnum" : `${id}`
    }
    await fetch(`/api/producto/${id}`, {
        method: 'POST',
        body: JSON.stringify(idnum),
        headers:{ 'Content-Type': 'application/json' }
        })
    window.location.href = window.location.href
}