const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
const app = express();
const port = 3006;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const JWT_SECRET = 'your_secret_key';

// MariaDBの接続設定
const mainDBConnection = mysql.createConnection({
    host: '192.168.3.31',
    user: 'AP',
    password: '0000',
    database: 'Minecraft_Mysqlinventory',
    port: 3306
});

const additionalDBConnection = mysql.createConnection({
    host: '192.168.3.31',
    user: 'AP',
    password: '0000',
    database: 'UserAdditionalData',
    port: 3306
});

mainDBConnection.connect((err) => {
    if (err) {
        console.error('Error connecting to main MariaDB:', err.stack);
        return;
    }
    console.log('Connected to main MariaDB as id ' + mainDBConnection.threadId);
});

additionalDBConnection.connect((err) => {
    if (err) {
        console.error('Error connecting to additional MariaDB:', err.stack);
        return;
    }
    console.log('Connected to additional MariaDB as id ' + additionalDBConnection.threadId);
});

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/api/users/:username', (req, res) => {
    const { username } = req.params;
    const query =
