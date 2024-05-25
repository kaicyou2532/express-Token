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

// ルートの設定
app.get('/', (req, res) => {
    res.render('index');
});

// ユーザー検索エンドポイント
app.get('/api/users/:username', (req, res) => {
    const { username } = req.params;
    const query = 'SELECT * FROM meb_inventory WHERE player_name = ?';
    mainDBConnection.query(query, [username], (err, results) => {
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
app.post('/api/users/:username/add-info', async (req, res) => {
    const { username } = req.params;
    const { password, webUsername } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const token = jwt.sign({ username: webUsername }, JWT_SECRET, { expiresIn: '1h' });
        
        const query = 'INSERT INTO user_data (username, password, web_username, token) VALUES (?, ?, ?, ?)';
        additionalDBConnection.query(query, [username, hashedPassword, webUsername, token], (err, results) => {
            if (err) {
                console.error('Error updating user info:', err);
                res.status(500).json({ error: 'Database error' });
            } else {
                res.json({ message: 'Additional info added successfully', token: token });
            }
        });
    } catch (err) {
        console.error('Error hashing password or generating token:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
