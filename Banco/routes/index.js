var express = require('express');
var router = express.Router();
var bd = require('./bd');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/Usuarios', function (req, res, next) {
  res.render('Usuarios', { title: 'Registro' });
});

router.post('/registrarUser', function (req, res) {
  const { nombre, email, pass } = req.body;
  const query = `
        INSERT INTO users (nombre, email, pass)
        VALUES (?, ?, ?)`;
  bd.query(query, [nombre, email, pass], (error, resultado) => {
    if (error) {
      console.error('Error al registrar la cuenta:', error);
      res.render('error', { mensaje: 'Error al registrar' });
    } else {
      res.render('mensaje', { mensaje: 'Se Ha Registrado correctamente' });
    }
  });
})

router.get('/login', function (req, res, next) {
  res.render('login', { title: 'Login' });
})

router.post('/loginUser', function (req, res) {
  const { email, pass } = req.body;
  const query = `
    SELECT id_user FROM users
    WHERE email=? AND pass=?`;
  console.log('Consulta SQL:', query);
  console.log('Valores:', [email, pass]);

  bd.query(query, [email, pass], (error, resultado) => {
    if (error) {
      console.error('Error al logear:', error);
      return res.render('error', { mensaje: 'Error al logear' });
    }
    console.log('Resultado de la consulta:', resultado);
    if (resultado && resultado.length > 0) {
      req.session.email = email;
      req.session.auth = true;
      req.session.userId = resultado[0].id_user;
      console.log('Valor:', req.session.auth);
      return res.render('mensaje', { mensaje: 'Usted se ha logueado correctamente' });
    } else {
      return res.render('error', { mensaje: 'Email o contraseña incorrectos' });
    }
  });
});

router.get('/panel', function (req, res, next) {
  var mensaje, ruta, button;
  if (req.session.email) {
    mensaje = req.session.email;
    ruta = '/logout';
    button = 'Cerrar Sesion';
  } else {
    mensaje = 'No tiene acceso permitido';
    ruta = '/login';
    button = 'Login';
  }

  res.render('panel', { mensaje, ruta, button, title: 'Panel de Control' });
});

router.get('/logout', function (req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al cerrar sesión:', err);
    } else {
      res.redirect('/login');
    }
  });
});

module.exports = router;