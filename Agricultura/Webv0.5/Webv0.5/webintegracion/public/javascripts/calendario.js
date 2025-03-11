document.addEventListener('DOMContentLoaded', function () {
    
    const diaActual = document.getElementById('dia-actual');
    if (diaActual) {
        const hoy = new Date();
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const fechaFormateada = hoy.toLocaleDateString('es-ES', opciones);
        diaActual.textContent = `Hoy es: ${fechaFormateada}`;
    }

   
    const btnProgramar = document.getElementById('btn-programar');
    const btnCancelar = document.getElementById('btn-cancelar');
    const programarRiego = document.getElementById('programar-riego');

    if (btnProgramar && programarRiego) {
        btnProgramar.addEventListener('click', () => {
            programarRiego.style.display = 'block';
        });

        btnCancelar.addEventListener('click', () => {
            programarRiego.style.display = 'none';
        });
    }

    
    flatpickr("#calendario-actual", {
        inline: true,          // El calendario siempre estará visible
        locale: "es",          // Configurar idioma español
        dateFormat: "Y-m-d",   // Formato de la fecha
        defaultDate: "today",  // Fecha predeterminada es hoy
        minDate: "today",      // No permite seleccionar fechas pasadas
    });
});
