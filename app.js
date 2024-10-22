const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const path = require('path');
const app = express();
const axios = require('axios');
const port = 3006;
require('dotenv').config(); //環境変数の読み込み

//microCMSのconfigのルーティング
const NewsRoutes = require('./routes/newsRoutes');
const InportantNoticesRoutes = require('./routes/InportantNoticeRoutes')
const services = require('./routes/CervicesRoutes')


app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
const JWT_SECRET = 'your_secret_key';

// //microCMSの接続設定
// const microCMSApiKey = 'your-api-key'; // MicroCMSのAPIキー
// const microCMSinportantURL = 'https://your-service-id.microcms.io/api/v1/news'; // 重要なお知らせ
// const microCMSnewsURL = 'https://your-service-id.microcms.io/api/v1/news'; // ニュース

// ニュース記事を追加するルート
app.post('/add-news', async (req, res) => {
  const { title, body, thumbnailUrl, publishedAt } = req.body;

  try {
    const response = await axios.post(microCMSBaseURL, {
      title,
      body,
      thumbnail: { url: thumbnailUrl },
      publishedAt
    }, {
      headers: {
        'X-MICROCMS-API-KEY': microCMSApiKey,
        'Content-Type': 'application/json'
      }
    });

    res.status(201).json({
      message: 'ニュース記事が正常に追加されました',
      data: response.data
    });
  } catch (error) {
    console.error('Error adding news article:', error);
    res.status(500).json({ message: 'ニュース記事の追加に失敗しました' });
  }
});

// MariaDBの接続設定
// ユーザー検索
const mainDBConnection = mysql.createConnection({
    host: '192.168.3.31',
    user: 'AP',
    password: '0000',
    database: 'Minecraft_Mysqlinventory',
    port: 3306
});
// ユーザー情報追加登録
const additionalDBConnection = mysql.createConnection({
    host: '192.168.3.31',
    user: 'AP',
    password: '0000',
    database: 'userdata',
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

        const query1 = 'INSERT INTO mypage_userdata (username, password, web_username, token) VALUES (?, ?, ?, ?)';
        additionalDBConnection.query(query1, [username, hashedPassword, webUsername, token], (err, results) => {
            if (err) {
                console.error('Error updating user info:', err);
                res.status(500).json({ error: 'Database error' });
                return;
            }

            const newUserId = results.insertId; // 追加されたレコードのIDを取得

            const query2 = 'INSERT INTO credit_userdata (id, mcname, webname, credit, inventory) VALUES (?, ?, ?, ?, ?)';
            additionalDBConnection.query(query2, [newUserId, username, webUsername, 1000, 1], (err, results) => {
                if (err) {
                    console.error('Error inserting into credit_userdata:', err);
                    res.status(500).json({ error: 'Database error' });
                } else {
                    res.json({ message: 'Additional info added successfully', token: token });
                }
            });
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

// 各ページへのルート

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/explain', (req, res) => {
    res.render('explain');
});

app.get('/service', (req, res) => {
    res.render('service'); 
});

app.get('/home', (req, res) => {
    res.render('home'); 
});

