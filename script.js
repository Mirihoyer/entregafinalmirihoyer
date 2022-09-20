
class Perchas {
    constructor(id, material, medida, color, stock, precio, cantidad, descripcion, imagen) {
        this.id = id;
        this.material = material;
        this.medida = medida;
        this.color = color;
        this.stock = stock;
        this.precio = precio;
        this.cantidad = cantidad;
        this.descripcion = descripcion;
        this.imagen = imagen;
    } 
}

let cardContainer = document.getElementById('card-container')
const contenedorCarrito = document.getElementById('cartContainer');
const abrirCarrito = document.getElementById('openCart')
const closeButton = document.getElementById('closeCart')
const guardarPercha = (clave, valor) => {
    localStorage.setItem(clave, valor)

};


const eliminarPercha = (clave) => { localStorage.removeItem(clave) };
let wasClosed = false;



let perchaMadera = []
fetch("./perchas.json")
    .then(res => res.json())
    .then(data => {
        perchaMadera = data;
        console.log(perchaMadera)
        renderPercha();
    })



function allStorage() {

    let values = [],
        keys = Object.keys(localStorage),
        i = keys.length;

    while (i--) {
        values.push(JSON.parse(localStorage.getItem(keys[i])));
    }

    return values;
}

function renderPercha() {
    for (const percha of perchaMadera) {
        let div = document.createElement(`div`)
        div.classList.add('col');
        div.innerHTML = ` 
      <div class="card">
     <img src="./imagenes/${percha.imagen}" class="card-img-top" alt="...">
     <div class="card-body">
       <h5 class="card-title"> Percha de ${percha.material} de color ${percha.color}</h5>
       <p class="card-text">${percha.descripcion}</p>
       <button href="#" class="btn btn-primary" id="add=${percha.id}">Agregar</button>
     </div>
   </div>
  `
        cardContainer.appendChild(div)
        let botonAgregarCar = document.getElementById(`add=${percha.id}`)
        botonAgregarCar.addEventListener('click', () => {
            addToCart(percha.id);
        })
    }
}

function openCart() {

    updateCart()

    const contenedorDeModal = document.getElementById('cartContainer')
    contenedorDeModal.classList.toggle('modal-active')



}

function addToCart(id) {
    let index = perchaMadera.findIndex((elemento) => { return elemento.id === id })
    if (perchaMadera[index].stock > 0) {
       
        perchaMadera[index].stock--
        perchaMadera[index].cantidad++
        guardarPercha(id, JSON.stringify(perchaMadera[index]))
        wasClosed = false;
        console.log(localStorage)
    }
}

function updateCart() {

    const contenedorDeLista = document.getElementById('listContainer')
    let carrito = localStorage.length > 0 ? allStorage() : [];
    const botonDeCompra = document.getElementById('botonCompra')
    if (localStorage.length === 0) {
        botonDeCompra.classList.add("boton-hidden")
    } else {
        botonDeCompra.classList.remove("boton-hidden")
    }

    for (const elemento of carrito) {
        let div = document.createElement('div')
        div.setAttribute('id', `${elemento.id}carrito`)
        div.setAttribute('class', 'productoEnCarrito')
        div.innerHTML += `<p>Percha de ${elemento.material}</p> 
                        <p>Color: ${elemento.color}</p>
                        <p id="${elemento.id}cantidad">Cantidad: ${elemento.cantidad}</p>
                        <p>Precio: $${elemento.precio}</p>
                        <button onclick ="removeFromCart(${elemento.id})" class="btn btn-danger btn-small" ><i class="fa-solid fa-trash"></i></button>`

        contenedorDeLista.appendChild(div)
    }
}


const removeFromCart = (id) => {
    let index = perchaMadera.findIndex((elemento) => { return elemento.id === id })
    Swal.fire({
        title: '¿Estás seguro?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Eliminar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {
            if (perchaMadera[index].cantidad > 1) {
                perchaMadera[index].cantidad--
                localStorage.setItem(perchaMadera[index].id, perchaMadera[index])
                let cantidad = document.getElementById(`${id}cantidad`)
                cantidad.innerHTML = `Cantidad: ${perchaMadera[index].cantidad}`
            } else {
                perchaMadera[index].cantidad--
                localStorage.removeItem(perchaMadera[index].id)
                document.getElementById(`${id}carrito`).remove();
            }
            checkCartLength()
            Swal.fire(
                'Eliminado',
                'Eliminaste satisfactoriamente el elemento',
                'success'
            )
        }
    })

}

function checkCartLength() {
    if (localStorage.length < 1) {
        const botonDeCompra = document.getElementById('botonCompra')
        botonDeCompra.classList.add("boton-hidden")
    }
}

function compraFinal() {
    closeCart()
    Swal.fire({
        title: '¿Estás seguro que desea realizar esta compra?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Comprar',
        cancelButtonText: 'Cancelar',
    }).then((result) => {
        if (result.isConfirmed) {

resetQuantity()
            localStorage.clear();
            Swal.fire(
                'Compraste',
                'La compra fue realizada con exito',
                'success'
            )
        }
    })
}

function resetQuantity() {
    perchaMadera.forEach(percha => {
        percha.cantidad = 0 
    } )
}

function closeCart() {

    const contenedorDeModal = document.getElementById('cartContainer')
    const contenedorDeLista = document.getElementById('listContainer')
    contenedorDeModal.classList.toggle('modal-active')
    wasClosed = true;
    while (contenedorDeLista.lastElementChild) {
        contenedorDeLista.removeChild(contenedorDeLista.lastElementChild);
    }

}

abrirCarrito.addEventListener('click', () => { openCart() })
closeButton.addEventListener('click', () => { closeCart() })

