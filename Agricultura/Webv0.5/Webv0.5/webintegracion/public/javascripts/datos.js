async function obtenerDatos() {
    try {
      const response = await fetch('/datos');
      const datos = await response.json();
  
      document.getElementById('temperatura').textContent = datos.temperatura || '--';
      document.getElementById('humedad').textContent = datos.humedad || '--';
    } catch (error) {
      console.error('Error al obtener datos:', error);
    }
  }
  
  // Actualizar datos cada 5 segundos
  setInterval(obtenerDatos, 5000);
  
  // Obtener datos al cargar la página
  obtenerDatos();
  