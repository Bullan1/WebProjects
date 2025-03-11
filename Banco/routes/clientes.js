var express = require('express')
var router = express.Router()
var bd = require('./bd')
var autenticador = require('./autenticador');

router.use(autenticador); 


router.get('/Clientes', function (req, res) {
  const auth = req.session.auth || false;
  res.render('Clientes', { auth });
});

//metodo registrar GET
router.get('/registrar', function (req, res, next) {
  res.render('registrar')
})

//Metodo POST registrar Cliente
router.post('/registrarCliente', function (req, res, next) {
  const regist = {
    run: req.body.run,
    nombre: req.body.nombre,
    direccion: req.body.direccion,
    email: req.body.email,
    telefono: req.body.telefono
  }
  bd.query('insert into clientes set ?', regist, function (error, resultado) {
    if (error) {
      console.log(error)
      return
    }
  })
  res.render('mensajeClientes', { mensaje: 'Se ha guardado el cliente correctamente' })
})


//Listado de registros
router.get('/listar', function (req, res, next) {
  bd.query('select * from clientes', function (error, filas) {
    if (error) {
      console.log('error en el listado')
      return
    }
    res.render('listarCliente', { clientes: filas })
  })
})


//Consulta get
router.get('/consulta', function (req, res, next) {
  res.render('consulta')
})

//consulta post
router.post('/consultaClientes', function (req, res, next) {
  var runCliente = req.body.run;
  bd.query('select * from clientes where run=?', runCliente, function (error, filas) {
    if (error) {
      console.log('error en la consulta')
      return
    }
    if (filas.length > 0) {
      res.render('listadoconsulta', { clientes: filas })
    } else {
      res.render('mensajeClientes', { mensaje: 'El run digitado no esta asociado' })
    }
  })
})


//Modificacion
router.get('/modificacion', function (req, res, next) {
  res.render('modificar')
})


router.post('/modificar', function (req, res, next) {
  bd.query('select * from clientes where id_cliente=?', req.body.id_cliente, function (error, filas) {
    if (error) {
      console.log('error en la consulta')
      return
    }
    if (filas.length > 0) {
      res.render('formulariomodifica', { clientes: filas })
    } else {
      res.render('mensajeClientes', { mensaje: 'No existe el Cliente ingresado' })
    }
  })
})


router.post('/confirmarmodifica', function (req, res, next) {
  const registro = {
    run: req.body.run,
    nombre: req.body.nombre,
    direccion: req.body.direccion,
    email: req.body.email,
    telefono: req.body.telefono
  };

  bd.query('UPDATE clientes SET ? WHERE id_cliente = ?', [registro, req.body.id_cliente], function (error, filas) {
    if (error) {
      console.log('error en la consulta');
      console.log(error);
      res.render('mensajeClientes', { mensaje: 'Error al modificar el cliente' });
      return;
    }
    res.render('mensajeClientes', { mensaje: 'El Cliente fue modificado' });
  });
});


module.exports = router