
function isAuthenticated(req, res, next) {
  if (req.session.auth) { // Verifica si el usuario está autenticado
    return next(); // Continúa con la siguiente función middleware/ruta
  } else {
    res.redirect('/login'); // Redirige al usuario a la página de login si no está autenticado
  }
}

module.exports = isAuthenticated;
