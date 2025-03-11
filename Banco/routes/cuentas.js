var express = require('express')
var router = express.Router()
var bd = require('./bd')
var autenticador = require('./autenticador'); 
router.use(autenticador); 

router.get('/cuentas', function (req, res) {
    const auth = req.session.auth || false;
    res.render('cuentas', { auth });
});

// Mostrar cuentas asociadas a un cliente
router.get('/formulario', (req, res) => {
    res.render('formulario'); // Renderiza el formulario para ingresar el ID del cliente
});

// POST para procesar el formulario de ingreso del ID del cliente
router.post('/listarForms', (req, res) => {
    const id_cliente = req.body.id_cliente;

    // Consulta SQL para obtener las cuentas asociadas al cliente
    const query = `
        SELECT c.id_cuenta, c.numero, c.fecha_apertura, tc.nombre AS tipo_cuenta
        FROM cuentas c
        INNER JOIN tipo_cuentas tc ON c.id_tipo = tc.id_tipo
        WHERE c.id_cliente = ?
    `;
    
    bd.query(query, id_cliente, (error, cuentas) => {
        if (error) {
            console.error('Error al obtener cuentas:', error);
            res.render('error', { mensajeCuentas: 'Error al obtener cuentas' });
        } else {
            res.render('cuentasCliente', { cuentas });
        }
    });
});


router.get('/registrar', function (req, res, next) {
    res.render('registrarCuenta')
})


// Registrar cuenta bancaria para un cliente
router.post('/registrarCuenta', (req, res) => {
    const {  numero, fecha_apertura, id_tipo,id_cliente } = req.body;

    // Consulta SQL para insertar la nueva cuenta
    const query = `
        INSERT INTO cuentas (numero, fecha_apertura, id_tipo, id_cliente)
        VALUES (?, ?, ?, ?)
    `;

    bd.query(query, [numero, fecha_apertura, id_tipo, id_cliente], (error, resultado) => {
        if (error) {
            console.error('Error al registrar la cuenta bancaria:', error);
            res.render('error', { mensajeCuentas: 'Error al registrar la cuenta bancaria' });
        } else {
            res.render('mensajeCuentas', { mensajeCuentas: 'Cuenta bancaria registrada correctamente' });
        }
    });
});

module.exports = router;
