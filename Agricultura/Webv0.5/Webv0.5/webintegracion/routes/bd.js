var mysql = require('mysql2')

var conexion = mysql.createConnection({
  host: 'localHost',
  user: 'root',
  password: 'root',
  database: 'riego'
})

conexion.connect(function (error) {
  if (error)
    console.log('Problemas de conexion con mysql')
  else
    console.log('se inicio conexion')
})


module.exports = conexion