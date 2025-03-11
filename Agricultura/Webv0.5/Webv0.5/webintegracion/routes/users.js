var express = require('express');
var router = express.Router();
var bd = require('./bd'); // Asegúrate de que el archivo de conexión a la base de datos esté configurado
var session = require('express-session');

// Configuración de la sesión
router.use(session({
  secret: 'mi-secreto', // Cambia esto por un valor más seguro
  resave: false,
  saveUninitialized: true
}));

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// Ruta del calendario
router.get('/Calendario', function (req, res, next) {
  if (!req.session.loggedin) {
    return res.redirect('/'); // Si el usuario no está logueado, redirige al login
  }

  res.render('Calendario', {
    title: 'Calendario',
    user: req.session.user,
    mensaje: req.flash('mensaje')// Pasar el mensaje aquí
  });
});

// Ruta para recibir datos del ESP8266
router.post('/api/sensor', function (req, res) {
  const { temperatura, humedad } = req.body;

  // Guardar datos del sensor temporalmente o en base de datos
  if (temperatura && humedad) {
    bd.query('INSERT INTO datos_sensor (temperatura, humedad, fecha) VALUES (?, ?, NOW())',
      [temperatura, humedad],
      function (error, results) {
        if (error) {
          console.error('Error al guardar datos del sensor:', error);
          return res.status(500).send('Error interno del servidor');
        }
        res.sendStatus(200); // Respuesta OK
      }
    );
  } else {
    res.status(400).send('Datos inválidos');
  }
});

// Ruta para obtener el último dato del sensor
router.get('/api/sensor', function (req, res) {
  bd.query('SELECT temperatura, humedad FROM datos_sensor ORDER BY fecha DESC LIMIT 1',
    function (error, results) {
      if (error) {
        console.error('Error al obtener datos del sensor:', error);
        return res.status(500).send('Error interno del servidor');
      }
      if (results.length > 0) {
        res.json(results[0]); // Enviar el último dato al cliente
      } else {
        res.json({ temperatura: null, humedad: null }); // No hay datos disponibles
      }
    }
  );
});

// Ruta para programar un riego
router.post('/api/riego', function (req, res) {
  const { fecha, hora, temperatura, humedad } = req.body;

  if (fecha && hora && temperatura && humedad) {
    bd.query('INSERT INTO riegos_programados (fecha, hora, temperatura, humedad) VALUES (?, ?, ?, ?)',
      [fecha, hora, temperatura, humedad],
      function (error, results) {
        if (error) {
          console.error('Error al programar riego:', error);
          return res.status(500).send('Error interno del servidor');
        }
        res.sendStatus(200); // Respuesta OK
      }
    );
  } else {
    res.status(400).send('Datos inválidos');
  }
});

router.post('/guardar-riego', (req, res) => {
  const { fecha, hora } = req.body;

  // Aquí guarda los datos en la base de datos
  bd.query(
    'INSERT INTO Riegos (fecha, hora) VALUES (?, ?)',
    [fecha, hora],
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error al guardar el riego.');
      }
      console.log('Riego guardado correctamente.')
      req.flash('mensaje', 'Riego registrado correctamente.');

      // Redirigir a la vista Calendario
      res.redirect('/users/Calendario');
    }
  );
});

// Ruta para obtener el historial de riegos
router.get('/historial', function (req, res, next) {
  if (!req.session.loggedin) {
    return res.redirect('/'); // Si el usuario no está logueado, redirige al login
  }

  // Obtener los riegos de la base de datos
  bd.query('SELECT * FROM Riegos ORDER BY fecha DESC, hora DESC', function (error, results) {
    if (error) {
      console.error('Error al obtener el historial de riegos:', error);
      return res.status(500).send('Error interno del servidor');
    }
    // Renderizar la vista con los resultados
    res.render('historial', {
      title: 'Historial de Riegos',
      user: req.session.user,
      riegos: results // Pasar los riegos a la vista
    });
  });
});



module.exports = router;
