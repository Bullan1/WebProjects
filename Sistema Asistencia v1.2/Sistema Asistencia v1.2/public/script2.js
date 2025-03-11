function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;
    document.getElementById('clock').innerText = timeString;
    document.getElementById('clock').innerText = timeString; // Actualiza la hora en el footer
}

updateTime(); // Llamar a la función para mostrar la hora actual al cargar la página
setInterval(updateTime, 1000); // Actualizar la hora cada segundo