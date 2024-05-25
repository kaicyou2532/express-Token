const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// MariaDBの接続設定
const connection = mysql.createConnection({
    host: '192.168.3.31',
    user: 'your_username',
    password: 'your_password',
    database: 'user_registration',
    port: 3306
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MariaDB:', err.stack);
        return;
    }
    console.log('Connected to MariaDB as id ' + connection.threadId);
});

// ルートの設定
app.get('/', (req, res) => {
    res.render('index');
});

// ユーザー検索エンドポイント
app.get('/api/users/:username', (req, res) => {
    const { username } = req.params;
    const query = 'SELECT * FROM users WHERE username = ?';
    connection.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            res.status(500).json({ error: 'Database error' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.json(results[0]);
        }
    });
});

// 追加情報登録エンドポイント
app.post('/api/users/:username/add-info', (req, res) => {
    const { username } = req.params;
    const { additionalInfo } = req.body;
    const query = 'UPDATE users SET additional_info = ? WHERE username = ?';
    connection.query(query, [additionalInfo, username], (err, results) => {
        if (err) {
            console.error('Error updating user info:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json({ message: 'Additional info added successfully' });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
