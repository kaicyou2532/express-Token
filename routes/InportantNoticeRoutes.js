const express = require('express');
const router = express.Router();
const microCMSClient = require('../config/microCMSConfig');

// ニュース記事の取得
router.get('/', async (req, res) => {
  try {
    const response = await microCMSClient.get('/InportantNotice');
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ message: 'ニュース記事の取得に失敗しました' });
  }
});

// ニュース記事の追加
router.post('/', async (req, res) => {
  const { title, body, thumbnailUrl, publishedAt } = req.body;

  try {
    const response = await microCMSClient.post('/InportantNotice', {
      title,
      body,
      thumbnail: { url: thumbnailUrl },
      publishedAt
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

module.exports = router;
