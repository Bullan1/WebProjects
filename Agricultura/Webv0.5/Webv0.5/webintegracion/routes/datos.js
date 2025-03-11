var express = require('express');
var router = express.Router();

let datosActuales = {}; // Variable para almacenar los datos del ESP8266

// Ruta POST para recibir datos del ESP8266
router.post('/', (req, res) => {
  datosActuales = req.body;
  console.log('Datos recibidos:', datosActuales);
  res.status(200).send('Datos recibidos correctamente');
});

// Ruta GET para enviar los datos a la vista
router.get('/', (req, res) => {
  res.render('datos', { datos: datosActuales });
});

module.exports = router;
