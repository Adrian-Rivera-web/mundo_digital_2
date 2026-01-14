// Obtener carrito desde localStorage
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

// Elementos del DOM
const contenedor = document.getElementById("carritoItems");
const carritoVacio = document.getElementById("carrito-empty");
const subtotalEl = document.getElementById("subtotal");
const totalEl = document.getElementById("total");

// --- RENDERIZAR CARRITO ---
function renderCarrito() {
    // Si el contenedor no existe (por si acaso), salimos
    if (!contenedor) return;

    contenedor.innerHTML = "";

    // Carrito vacío
    if (carrito.length === 0) {
        carritoVacio.style.display = "block";
        if(subtotalEl) subtotalEl.textContent = "$0";
        if(totalEl) totalEl.textContent = "$0";
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

    if(subtotalEl) subtotalEl.textContent = "$" + subtotal.toLocaleString("es-CL");
    if(totalEl) totalEl.textContent = "$" + subtotal.toLocaleString("es-CL");

    localStorage.setItem("carrito", JSON.stringify(carrito));
}

// --- CAMBIAR CANTIDAD ---
// (La hacemos global para que el HTML la encuentre)
window.cambiarCantidad = function(index, cambio) {
    carrito[index].cantidad += cambio;
    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }
    renderCarrito();
};

// Ejecutar al cargar
renderCarrito();

// Botón Seguir Comprando
const btnSeguir = document.getElementById("seguir-comprando");
if(btnSeguir) {
    btnSeguir.addEventListener("click", () => {
        window.location.href = "producto.html";
    });
}

// --- LÓGICA DEL CHECKOUT (AQUÍ ESTÁ EL CAMBIO) ---
const btnCheckout = document.getElementById("checkout");

if(btnCheckout) {
    btnCheckout.addEventListener("click", () => {

        // 1. VERIFICAR LOGIN
        const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

        if (!usuarioLogueado) {
            // Si no hay usuario, alerta y redirección
            alert("🔒 Para finalizar la compra, necesitas iniciar sesión.");
            window.location.href = "login.html";
            return; // Detiene la función aquí, no genera boleta
        }

        // 2. Si hay usuario, procedemos con la compra
        const carritoActual = JSON.parse(localStorage.getItem("carrito")) || [];
        
        if(carritoActual.length === 0) {
            alert("Tu carrito está vacío.");
            return;
        }

        // Calcular total
        let total = carritoActual.reduce((acc, item) => {
            return acc + (item.precio * item.cantidad);
        }, 0);

        // 3. Crear Boleta (Ahora incluimos los datos del cliente)
        const boleta = {
            fecha: new Date().toLocaleString(),
            cliente: usuarioLogueado.nombre, // ¡Dato importante!
            email: usuarioLogueado.email,
            productos: carritoActual,
            total: total
        };

        localStorage.setItem("boleta", JSON.stringify(boleta));

        // 4. Limpiar carrito y redirigir
        localStorage.removeItem("carrito");
        
        alert("✅ ¡Compra exitosa! Generando boleta...");
        window.location.href = "boleta.html";
    });
}