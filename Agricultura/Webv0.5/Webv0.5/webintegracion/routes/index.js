var express = require('express');
var router = express.Router();
var bd = require('./bd');
var session = require('express-session'); // Importa express-session

// Configuración de la sesión
router.use(session({
  secret: 'mi-secreto', // Cambia esto por un valor más seguro
  resave: false,
  saveUninitialized: true
}));

// Ruta GET para la página de inicio (index)
router.get('/', function (req, res, next) {
  // Destruir la sesión si existe
  req.session.destroy(function (err) {
    if (err) {
      console.log('Error al destruir la sesión:', err);
    }
    // Renderizar la página de inicio
    res.render('index', { title: 'Home', isHome: true });
  });
});


/* Método POST para registro */
router.post('/registrarse', function (req, res, next) {
  const regist = {
    name: req.body.name,
    email: req.body.email,
    pass: req.body.pass,
  };

  bd.query('INSERT INTO usuarios SET ?', regist, function (error, resultado) {
    if (error) {
      console.error('Error al registrar el usuario:', error);
    }

    // Registro exitoso
    console.log("Registrado Existosamente")
  });
});


/* Método GET para despues del login */
/* Método GET para despues del login */
router.get('/panel', function (req, res, next) {
  if (!req.session.loggedin) {
    return res.redirect('/'); // Si el usuario no está logueado, redirige al login
  }
  // Aquí pasas el nombre del usuario a la vista
  res.render('panel', { title: 'Dashboard', user: req.session.user });
});


/* Método POST para inicio de sesión */
router.post('/login', function (req, res, next) {
  const { email, pass } = req.body;

  bd.query('SELECT * FROM usuarios WHERE email = ? AND pass = ?', [email, pass], function (error, resultados) {
    if (error) {
      console.log(error);
      return;
    } else {
      console.log("Conexion existosa");
    }

    if (resultados.length > 0) {
      // Si el usuario existe y la contraseña es correcta, guarda la sesión
      req.session.loggedin = true;
      req.session.user = resultados[0]; // Guarda toda la información del usuario
      req.session.userId = resultados[0].id; // Guarda el ID del usuario
      console.log("Sesión iniciada:", req.session.user); // Verifica que la sesión se guarda
      res.redirect('/panel'); // Redirige al panel
    } else {
      console.log("Credenciales incorrectas");
      res.render('index', {
        successMessage: 'Credenciales Incorrectas intente nuevamente'
      });
    }
  });
});

/* METODO GET MODIFICAR USUARIO */

// Ruta GET para mostrar el formulario de edición con los datos del usuario
router.get('/editar', function (req, res, next) {
  if (!req.session.loggedin) {
    return res.redirect('/'); // Si el usuario no está logueado, redirige al login
  }

  // Obtener el ID del usuario desde la sesión
  const userId = req.session.user.id;

  // Consultar la base de datos para obtener los datos del usuario
  bd.query('SELECT name, email, pass FROM usuarios WHERE id = ?', [userId], function (error, filas) {
    if (error) {
      console.log('Error al obtener la información del usuario:', error);
      return res.status(500).send('Error al obtener la información del usuario');
    }

    if (filas.length === 0) {
      return res.status(404).send('Usuario no encontrado');
    }

    // Mostrar los datos del usuario en el formulario de edición
    res.render('editar', { user: filas[0] });
  });
});


/* METODO POST MODIFICAR USUARIO */

// Ruta POST para modificar los datos del usuario
router.post('/editar', function (req, res, next) {
  if (!req.session.loggedin) {
    return res.redirect('/'); // Si el usuario no está logueado, redirige al login
  }

  // Obtener los nuevos datos del formulario
  const updatedUser = {
    name: req.body.name,
    email: req.body.email,
    pass: req.body.pass
  };

  // Obtener el ID del usuario desde la sesión
  const userId = req.session.user.id;

  // Actualizar los datos del usuario en la base de datos
  bd.query('UPDATE usuarios SET ? WHERE id = ?', [updatedUser, userId], function (error, result) {
    if (error) {
      console.log('Error al modificar los datos del usuario:', error);
      return res.status(500).send('Error al modificar los datos del usuario');
    }

    // Actualizar los datos de la sesión con los nuevos valores
    req.session.user.name = updatedUser.name;
    req.session.user.email = updatedUser.email;
    req.session.user.pass = updatedUser.pass;

    // Redirigir al panel de usuario o a donde desees
    res.redirect('/panel'); // O la ruta que prefieras
  });
});


/* METODO GET ELIMINAR USUARIO */
// Ruta GET para mostrar la página de eliminación del usuario
router.get('/eliminar', function (req, res, next) {
  if (!req.session.loggedin) {
    return res.redirect('/'); // Si el usuario no está logueado, redirige al login
  }

  // Obtener el ID del usuario desde la sesión
  const userId = req.session.user.id;

  // Consultar la base de datos para obtener los datos del usuario (opcional, solo si deseas mostrar los datos en la página)
  bd.query('SELECT name, email FROM usuarios WHERE id = ?', [userId], function (error, filas) {
    if (error) {
      console.log('Error al obtener la información del usuario:', error);
      return res.status(500).send('Error al obtener la información del usuario');
    }

    if (filas.length === 0) {
      return res.status(404).send('Usuario no encontrado');
    }

    // Renderizar la página de eliminación
    res.render('eliminar', { user: filas[0] });
  });
});


/* METODO POST ELIMINAR USUARIO */

// Ruta POST para eliminar el usuario
router.post('/eliminar', function (req, res, next) {
  if (!req.session.loggedin) {
    return res.redirect('/'); // Si el usuario no está logueado, redirige al login
  }

  // Obtener el ID del usuario desde la sesión
  const userId = req.session.user.id;

  // Eliminar al usuario de la base de datos
  bd.query('DELETE FROM usuarios WHERE id = ?', [userId], function (error, result) {
    if (error) {
      console.log('Error al eliminar el usuario:', error);
      return res.status(500).send('Error al eliminar el usuario');
    }

    // Destruir la sesión del usuario después de eliminar la cuenta
    req.session.destroy(function (err) {
      if (err) {
        console.log('Error al destruir la sesión:', err);
        return res.status(500).send('Error al destruir la sesión');
      }

      // Redirigir al inicio de sesión o a donde prefieras
      res.redirect('/'); // Redirige al login después de eliminar la cuenta
    });
  });
});



// Ruta GET para listar la información del usuario actual
router.get('/listar', function (req, res, next) {
  // Verificar si el usuario está autenticado
  if (!req.session.loggedin) {
    return res.redirect('/'); // Redirigir a la página de login si no está autenticado
  }

  // Obtener la id del usuario desde la sesión
  const userId = req.session.user.id;  // Usar el id del usuario guardado en la sesión

  // Consultar la base de datos para obtener los datos del usuario con el id correspondiente
  bd.query('SELECT name, email, pass FROM usuarios WHERE id = ?', [userId], function (error, filas) {
    if (error) {
      console.log('Error al obtener la información del usuario:', error);
      return res.status(500).send('Error al obtener la información del usuario');
    }

    // Verificar si se encontró al usuario
    if (filas.length === 0) {
      return res.status(404).send('Usuario no encontrado');
    }

    // Renderizar la página con los datos del usuario
    res.render('listar', { usuario: filas[0] }); // Suponiendo que 'listar' es tu vista
  });
});

// Ruta para cerrar sesión
router.post('/logout', function (req, res) {
  req.session.destroy(function(err) {
    if (err) {
      return res.redirect('/panel'); // Si hubo un error al destruir la sesión, redirige al panel
    }
    res.redirect('/'); // Si la sesión fue destruida correctamente, redirige al inicio
  });
});





module.exports = router;
