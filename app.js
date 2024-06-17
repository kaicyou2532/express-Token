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
    const query = 'SELECT * FROM meb_inventory WHERE player_name = ?';
    mainDBConnection.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            res.status(500).json({ error: 'エラーコード:[t500][基幹システムエラー。お手数おかけしますが、エラーコードとともに、運営にご報告お願い致します]' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'エラーコード:[t404][オプ鯖での参加ユーザーのリストにありません。ユーザー名を確認して入力し直すか、オプ鯖に参加したことがない方は先に参加してください。]' });
        } else {
            res.json(results[0]);
        }
    });
});

app.post('/api/users/:username/add-info', async (req, res) => {
    const { username } = req.params;
    const { password, webUsername } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const token = jwt.sign({ user: username }, JWT_SECRET, { expiresIn: '1h' });

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
        res.status(500).json({ error: 'エラーコード:[t500][基幹システムエラー。お手数おかけしますが、エラーコードとともに、運営にご報告お願い致します]' });
    }
});

app.get('/api/users/:username/recover-token', (req, res) => {
    const { username } = req.params;
    const query = 'SELECT token FROM user_data WHERE username = ?';
    additionalDBConnection.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error fetching token:', err);
            res.status(500).json({ error: 'エラーコード:[t500][基幹システムエラー。お手数おかけしますが、エラーコードとともに、運営にご報告お願い致します]' });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'エラーコード:[t405][既にトークンが発行されているユーザーのリストに名前が見つかりませんでした。ユーザー名を確認して入力し直すか、マイページの情報登録を先に行ってください。]' });
        } else {
            res.json({ token: results[0].token });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


app.get('/explain', (req, res) => {
    res.render('explain'); // ここで 'new-page.ejs' を表示します
});