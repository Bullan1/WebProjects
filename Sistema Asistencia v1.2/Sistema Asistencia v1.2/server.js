const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const app = express();
const port = 3000;

// Configuración de middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuración de conexión a MySQL
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'asistencia'
});

const promisePool = pool.promise();

// Ruta de login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [rows] = await promisePool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
        if (rows.length > 0) {
            res.json({ id: rows[0].id, role: rows[0].role });
        } else {
            res.status(401).send('Credenciales inválidas');
        }
    } catch (error) {
        res.status(500).send('Error al realizar la consulta');
    }
});

// Ruta para marcar entrada
app.post('/attendance/entry', async (req, res) => {
    const { userId } = req.body;
    const now = new Date();
    try {
        await promisePool.query('INSERT INTO attendance (user_id, entry_time) VALUES (?, ?)', [userId, now]);
        res.json({ date: now.toDateString(), time: now.toTimeString() });
    } catch (error) {
        res.status(500).send('Error al registrar entrada');
    }
});

// Ruta para marcar salida
app.post('/attendance/exit', async (req, res) => {
    const { userId } = req.body;
    const now = new Date();
    try {
        await promisePool.query('UPDATE attendance SET exit_time = ? WHERE user_id = ? AND entry_time IS NOT NULL AND exit_time IS NULL', [now, userId]);
        res.json({ date: now.toDateString(), time: now.toTimeString() });
    } catch (error) {
        res.status(500).send('Error al registrar salida');
    }
});

// Ruta para obtener entradas tardías
app.get('/report/late-entries', async (req, res) => {
    const now = new Date();
    const cutoff = new Date();
    cutoff.setHours(9, 30, 0, 0);
    try {
        const [rows] = await promisePool.query('SELECT u.email, a.entry_time FROM attendance a JOIN users u ON a.user_id = u.id WHERE a.entry_time > ?', [cutoff]);
        res.json(rows);
    } catch (error) {
        res.status(500).send('Error al obtener reportes de entradas tardías');
    }
});

// Ruta para obtener salidas anticipadas
app.get('/report/early-exits', async (req, res) => {
    const cutoff = new Date();
    cutoff.setHours(17, 30, 0, 0);
    try {
        const [rows] = await promisePool.query('SELECT u.email, a.exit_time FROM attendance a JOIN users u ON a.user_id = u.id WHERE a.exit_time < ? AND a.entry_time IS NOT NULL', [cutoff]);
        res.json(rows);
    } catch (error) {
        res.status(500).send('Error al obtener reportes de salidas anticipadas');
    }
});

// Ruta para obtener registros faltantes
app.get('/report/missing-records', async (req, res) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    try {
        const [rows] = await promisePool.query('SELECT u.email FROM users u LEFT JOIN attendance a ON u.id = a.user_id AND DATE(a.entry_time) = ? WHERE a.entry_time IS NULL AND a.exit_time IS NULL', [today]);
        res.json(rows);
    } catch (error) {
        res.status(500).send('Error al obtener reportes de registros faltantes');
    }
});

// Ruta para crear usuario
app.post('/users/create', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        await promisePool.query('INSERT INTO users (email, password, role) VALUES (?, ?, ?)', [email, password, role]);
        res.send('Usuario creado correctamente');
    } catch (error) {
        res.status(500).send('Error al crear usuario');
    }
});

// Ruta para actualizar usuario
app.post('/users/update', async (req, res) => {
    const { id, email, password, role } = req.body;
    const updates = [];
    const values = [];
    if (email) { updates.push('email = ?'); values.push(email); }
    if (password) { updates.push('password = ?'); values.push(password); }
    if (role) { updates.push('role = ?'); values.push(role); }
    values.push(id);

    try {
        await promisePool.query(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`, values);
        res.send('Usuario modificado correctamente');
    } catch (error) {
        res.status(500).send('Error al modificar usuario');
    }
});

// Ruta para eliminar usuario
app.post('/users/delete', async (req, res) => {
    const { id } = req.body;
    try {
        await promisePool.query('DELETE FROM users WHERE id = ?', [id]);
        res.send('Usuario eliminado correctamente');
    } catch (error) {
        res.status(500).send('Error al eliminar usuario');
    }
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

