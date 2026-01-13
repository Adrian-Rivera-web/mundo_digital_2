const productos = [
  {
    id: 1,
    nombre: "Notebook Gamer",
    precio: 79990,
    imagen: "producto1.jpg",
    descripcion: "Notebook de alto rendimiento ideal para juegos y trabajo pesado.",
    categoria: "Computación",
    stock: 8,
    vendidos: 120,
    oferta: true
  },
  {
    id: 2,
    nombre: "Mouse Inalámbrico",
    precio: 15990,
    imagen: "producto2.jpg",
    descripcion: "Mouse inalámbrico con conexión USB y diseño ergonómico.",
    categoria: "Accesorios",
    stock: 25,
    vendidos: 12
  },
  {
    id: 3,
    nombre: "Teclado Mecánico",
    precio: 45990,
    imagen: "producto3.jpg",
    descripcion: "Teclado mecánico con retroiluminación RGB.",
    categoria: "Accesorios",
    stock: 12,
    vendidos: 50,
    oferta: true
  },
  {
    id: 4,
    nombre: "Monitor Gamer 24 pulgadas",
    precio: 189990,
    imagen: "producto4.jpg",
    descripcion: "Monitor Full HD de 24 pulgadas ideal para gaming.",
    categoria: "Computación",
    stock: 10,
  },
  {
    id: 5,
    nombre: "Audífonos Bluetooth Inalámbricos",
    precio: 49990,
    imagen: "producto5.jpg",
    descripcion: "Audífonos inalámbricos con cancelación de ruido.",
    categoria: "Audio",
    stock: 18
  },
  {
    id: 6,
    nombre: "Silla Gamer Ergonómica",
    precio: 229990,
    imagen: "producto6.jpg",
    descripcion: "Silla ergonómica diseñada para largas sesiones de uso.",
    categoria: "Muebles",
    stock: 5
  },
  {
    id: 7,
    nombre: "Disco Duro Externo 1TB",
    precio: 65990,
    imagen: "producto7.jpg",
    descripcion: "Disco duro externo portátil con conexión USB 3.0.",
    categoria: "Almacenamiento",
    stock: 20,
  },
  {
    id: 8,
    nombre: "Smartwatch Deportivo",
    precio: 79990,
    imagen: "producto8.jpg",
    descripcion: "Reloj inteligente con funciones deportivas y de salud.",
    categoria: "Wearables",
    stock: 14,
    vendidos:40
  }
];


const categorias = [
  {
    nombre: "Computación",
    icono: "fa-solid fa-laptop"
  },
  {
    nombre: "Accesorios",
    icono: "fa-solid fa-keyboard"
  },
  {
    nombre: "Gaming",
    icono: "fa-solid fa-gamepad"
  },
  {
    nombre: "Audio",
    icono: "fa-solid fa-headphones"
  },
  {
    nombre: "Almacenamiento",
    icono: "fa-solid fa-hard-drive"
  },
];

/**esto es para el categoria*/
const contenedorCategorias = document.getElementById("contenedor-categorias");

if (contenedorCategorias) {
  categorias.forEach(cat => {
    const div = document.createElement("div");
    div.className = "categoria-card";

    div.innerHTML = `
      <i class="${cat.icono} categoria-icono"></i>
      <h3>${cat.nombre}</h3>
    `;

    contenedorCategorias.appendChild(div);
  });
}




/*esto es del index para los mas vendidos adrian* */
/* MÁS VENDIDOS (INDEX) */
const masVendidos = productos
  .filter(p => p.vendidos && p.vendidos > 0)
  .sort((a, b) => b.vendidos - a.vendidos);

const contenedorMasVendidos = document.getElementById("mas-vendidos");

if (contenedorMasVendidos) {
  if (masVendidos.length === 0) {
    contenedorMasVendidos.innerHTML = "<p>No hay productos vendidos aún</p>";
  } else {
    masVendidos.forEach(p => {
      contenedorMasVendidos.innerHTML += `
        <div class="producto">
          <img src="img/${p.imagen}" alt="${p.nombre}">
          <h3>${p.nombre}</h3>
          <p>$${p.precio.toLocaleString("es-CL")}</p>
        </div>
      `;
    });
  }
}

/* TODOS LOS PRODUCTOS (PRODUCTOS.HTML) */
/* === LÓGICA DE PRODUCTOS: CARGA, SPINNER Y CARRITO === */
const contenedorProductos = document.getElementById("contenedor-productos");

// Asegúrate de que estos IDs existan en tu HTML
const spinner = document.getElementById("loading-spinner");
const mensaje = document.getElementById("mensaje-agregado");

if (contenedorProductos) {
  // Recorremos tu lista de productos (asegúrate de que el array 'productos' exista arriba)
  productos.forEach(producto => {
    
    // 1. Crear la tarjeta del producto
    const div = document.createElement("div");
    div.className = "producto";
    div.innerHTML = `
      <img src="../img/${producto.imagen}" alt="${producto.nombre}">
      <h3>${producto.nombre}</h3>
      <p class="precio">$${producto.precio.toLocaleString("es-CL")}</p>
      <button class="btn-producto">Añadir</button>
    `;
    
    contenedorProductos.appendChild(div);

    // 2. Asignar la función al botón "Añadir"
    const boton = div.querySelector(".btn-producto");
    
    boton.addEventListener("click", () => {
        
        // A) Mostrar el Spinner visualmente
        if(spinner) spinner.style.display = "flex";
        if(mensaje) mensaje.style.display = "none"; // Ocultar mensaje anterior si lo hubiera

        // B) Usar setTimeout para dar tiempo a ver la animación (0.5 seg)
        setTimeout(() => {
            
            // --- LÓGICA DE GUARDADO EN LOCALSTORAGE ---
            let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
            const productoEnCarrito = carrito.find(p => p.id === producto.id);

            if (productoEnCarrito) {
                productoEnCarrito.cantidad++;
            } else {
                carrito.push({
                    id: producto.id,
                    nombre: producto.nombre,
                    precio: producto.precio,
                    imagen: producto.imagen,
                    cantidad: 1
                });
            }
            localStorage.setItem("carrito", JSON.stringify(carrito));
            // ------------------------------------------

            // C) Ocultar Spinner y Mostrar Mensaje de Éxito
            if(spinner) spinner.style.display = "none";
            
            if(mensaje) {
                mensaje.textContent = "✅ Producto agregado";
                mensaje.style.display = "block";
                
                // D) Quitar el mensaje automáticamente a los 2 segundos
                setTimeout(() => {
                    mensaje.style.display = "none";
                }, 750);
            }

        }, 200); // Tiempo de espera (medio segundo)
    });
  });
}









/* OFERTA DESTACADA (INDEX) */
const productoOferta = productos.find(p => p.oferta === true);

const contenedorOferta = document.getElementById("oferta-destacada");

if (contenedorOferta && productoOferta) {
  contenedorOferta.innerHTML = `
    <div class="producto oferta">
      <span class="badge-oferta">OFERTA</span>
      <img src="img/${productoOferta.imagen}" alt="${productoOferta.nombre}">
      <h3>${productoOferta.nombre}</h3>
      <p class="precio">$${productoOferta.precio.toLocaleString("es-CL")}</p>
    </div>
  `;
}

