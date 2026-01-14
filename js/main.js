document.addEventListener("DOMContentLoaded", function() {
    // Verificar usuario logueado
    const usuarioLogueado = JSON.parse(localStorage.getItem('usuarioLogueado'));
    
    if (usuarioLogueado) {
        const contenedorUsuario = document.querySelector('.usuario-izquierda');
        
        // Verificamos que el elemento exista en la página actual
        if (contenedorUsuario) {
            const textoHola = contenedorUsuario.querySelector('.hola');
            const textoInicia = contenedorUsuario.querySelector('.inicia');

            if (textoHola) textoHola.textContent = "¡Hola!";
            if (textoInicia) textoInicia.textContent = usuarioLogueado.nombre;
            
            // Lógica para cerrar sesión
            contenedorUsuario.href = "#"; 
            contenedorUsuario.addEventListener('click', function(e) {
                e.preventDefault();
                if(confirm(`¿Cerrar sesión de ${usuarioLogueado.nombre}?`)) {
                    localStorage.removeItem('usuarioLogueado');
                    window.location.reload(); // Recarga la página
                }
            });
        }
    }
});