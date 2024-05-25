
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: '192.168.3.31:3306',
  user: 'minecraft',
  password: '0000',
  database: 'Minecraft_Mysqlinventory'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MariaDB:', err.stack);
    return;
  }
  console.log('Connected to MariaDB as id ' + connection.threadId);
});

module.exports = connection;
