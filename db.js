import mysql from "mysql2";

// Crear la conexión
const connection = mysql.createConnection({
    host: 'localhost',      // El servidor de base de datos
    user: 'root',           // Tu usuario de base de datos
    password: 'Santiago1309', // Tu contraseña de base de datos
    database: 'micrempresa2' // El nombre de tu base de datos
});

// Conectar a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err.stack);
        return;
    }
    console.log('Conectado a la base de datos.');
});

export default connection;


