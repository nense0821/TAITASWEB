function mostrar(id) {

    let secciones = document.querySelectorAll('.seccion');

    secciones.forEach(sec => {
        sec.style.display = "none";
    });

    document.getElementById(id).style.display = "block";

    window.scrollTo({
   top:0,
   behavior: "smooth"
});
}

mostrar('arepas')
let costoDomicilio= 0;
let carrito = [];
let total = 0;

function agregarAlCarrito(nombre, precio) {
    carrito.push({ nombre, precio });

    total += precio;

    actualizarCarrito();

    const carritoUI = document.getElementById("carrito");

carritoUI.classList.add("animar-carrito");

setTimeout(() => {
  carritoUI.classList.remove("animar-carrito");
}, 300);
}

function actualizarCarrito() {

    let lista = document.getElementById("carrito");
    lista.innerHTML = "";

    carrito.forEach((producto, index) => {

        let li = document.createElement("li");

        li.innerHTML = `
            ${producto.nombre} - $${producto.precio}
            <button onclick="eliminarProducto(${index})">❌</button>
        `;

        lista.appendChild(li);
    });

    actualizarTotalFinal();
}

function eliminarProducto(index) {

    total -= carrito[index].precio;

    carrito.splice(index, 1);

    actualizarCarrito();
}


function enviarPedido() {

    let nombre = document.getElementById("nombreCliente").value.trim();
    let direccion = document.getElementById("direccionCliente").value.trim();
    let zona = document.getElementById("zona").value;

    if (carrito.length === 0) {
        alert("El carrito está vacío");
        return;
    }

    if (nombre === "" || direccion === "" || zona === "") {
        alert("Por favor completa todos los datos y selecciona tu zona");
        return;
    }

    let totalFinal = total + costoDomicilio;

    let mensaje = "Hola, quiero hacer el siguiente pedido:%0A%0A";

    carrito.forEach(producto => {
        mensaje += "- " + producto.nombre + " - $" + producto.precio + "%0A";
    });

    mensaje += "%0A Domicilio: $" + costoDomicilio;
    mensaje += "%0A Total: $" + totalFinal;
    mensaje += "%0A%0A Nombre: " + nombre;
    mensaje += "%0A Dirección: " + direccion;

    let numero = "573202471731"; 

    let url = "https://wa.me/" + numero + "?text=" + mensaje;

    window.open(url, "_blank");
}

function calcularDomicilio() {

    let select = document.getElementById("zona");
    costoDomicilio = parseInt(select.value);

    document.getElementById("costoDomicilio").textContent = costoDomicilio;

    actualizarTotalFinal();
}

function actualizarTotalFinal() {

    let totalFinal = total + costoDomicilio;

    document.getElementById("total").textContent = totalFinal;
}

const carritoUI = document.getElementById("carrito");

let isDragging = false;
let offsetX, offsetY;

carritoUI.addEventListener("mousedown", (e) => {
  isDragging = true;
  offsetX = e.clientX - carritoUI.offsetLeft;
  offsetY = e.clientY - carritoUI.offsetTop;
  carritoUI.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  carritoUI.style.left = e.clientX - offsetX + "px";
  carritoUI.style.top = e.clientY - offsetY + "px";
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  carritoUI.style.cursor = "grab";
});

function animarVuelo(boton) {

  const tarjeta = boton.closest('.card');
  const carrito = document.getElementById("carrito");

  const clon = tarjeta.cloneNode(true);

  const rect = tarjeta.getBoundingClientRect();
  const rectCarrito = carrito.getBoundingClientRect();

  const startX = rect.left;
  const startY = rect.top;

  const endX = rectCarrito.left;
  const endY = rectCarrito.top;

  const deltaX = endX - startX;
  const deltaY = endY - startY;

  const distancia = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const duracion = distancia * 0.0025;

  clon.style.position = "fixed";
  clon.style.left = startX + "px";
  clon.style.top = startY + "px";
  clon.style.width = rect.width + "px";
  clon.style.zIndex = "9999";
  clon.style.pointerEvents = "none";
  clon.style.willChange = "transform, opacity";

  document.body.appendChild(clon);

  const inicio = performance.now();

  function animarFrame(tiempo) {

    const progreso = (tiempo - inicio) / (duracion * 1000);

    if (progreso >= 1) {
      clon.remove();
      return;
    }

    // Movimiento lineal base
    const actualX = deltaX * progreso;
    const actualY = deltaY * progreso;

    // 🎯 Curva parabólica (ajusta 150 si quieres más arco)
    const curva = -150 * Math.sin(Math.PI * progreso);

    clon.style.transform = `
      translate(${actualX}px, ${actualY + curva}px)
      scale(${1 - progreso * 0.5})
    `;

    clon.style.opacity = 1 - progreso;

    requestAnimationFrame(animarFrame);
  }
  requestAnimationFrame(animarFrame);
}

function animarYAgregar(boton, nombreProducto, precioProducto) {
    // Buscar si hay un input de personalización dentro de la tarjeta
    const tarjeta = boton.closest('.card');
    const inputPersonalizado = tarjeta.querySelector('.personalizacion');
    let personalizacion = "";

    if (inputPersonalizado) {
        personalizacion = inputPersonalizado.value.trim();
        if (personalizacion) {
            nombreProducto += " (" + personalizacion + ")";
        }
    }

    animarVuelo(boton);

    setTimeout(() => {
        agregarAlCarrito(nombreProducto, precioProducto);
    }, 300);
}