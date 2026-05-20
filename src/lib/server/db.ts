import mysql from 'mysql2/promise';

// Configura tu pool de conexiones para la base de datos MySQL
export const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    user: 'root', // Reemplaza con tu usuario
    database: 'ticketary', // Reemplaza con el nombre de tu base de datos
    password: '', // Reemplaza con tu contraseña
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, por defecto igual a connectionLimit
    idleTimeout: 60000, // tiempo de inactividad, por defecto 60000 ms
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});
