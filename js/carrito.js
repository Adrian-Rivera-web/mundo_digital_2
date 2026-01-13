// Obtener carrito desde localStorage
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Elementos del DOM (COINCIDEN con tu HTML)
const contenedor = document.getElementById("carritoItems");
const carritoVacio = document.getElementById("carrito-empty");
const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");

// Renderizar carrito
function renderCarrito() {
  contenedor.innerHTML = "";

  // Carrito vacío
  if (carrito.length === 0) {
    carritoVacio.style.display = "block";
    subtotalEl.textContent = "$0";
    totalEl.textContent = "$0";
    return;
  }

  carritoVacio.style.display = "none";

  let subtotal = 0;

  carrito.forEach((producto, index) => {
    const subtotalProducto = producto.precio * producto.cantidad;
    subtotal += subtotalProducto;

    const div = document.createElement("div");
    div.classList.add("carrito-producto");

    div.innerHTML = `
      <img src="../img/${producto.imagen}" alt="${producto.nombre}">
      <div class="carrito-info">
        <h4>${producto.nombre}</h4>
        <p>$${producto.precio.toLocaleString("es-CL")}</p>

        <div class="cantidad">
          <button onclick="cambiarCantidad(${index}, -1)">−</button>
          <span>${producto.cantidad}</span>
          <button onclick="cambiarCantidad(${index}, 1)">+</button>
        </div>

        <p><strong>Subtotal:</strong> $${subtotalProducto.toLocaleString("es-CL")}</p>
      </div>
    `;

    contenedor.appendChild(div);
  });

  subtotalEl.textContent = "$" + subtotal.toLocaleString("es-CL");
  totalEl.textContent = "$" + subtotal.toLocaleString("es-CL");

  // Guardar cambios
  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Cambiar cantidad
function cambiarCantidad(index, cambio) {
  carrito[index].cantidad += cambio;

  if (carrito[index].cantidad <= 0) {
    carrito.splice(index, 1);
  }

  renderCarrito();
}

// Ejecutar al cargar la página
renderCarrito();
