const axios = require('axios');

// MicroCMSのAPIキーとURLの設定（.envファイルから読み込み）
const microCMSApiKey = process.env.MICROCMS_API_KEY;
const microCMSBaseURL = process.env.MICROCMS_BASE_URL;

const microCMSClient = axios.create({
  baseURL: microCMSBaseURL,
  headers: {
    'X-MICROCMS-API-KEY': microCMSApiKey,
    'Content-Type': 'application/json'
  }
});

module.exports = microCMSClient;
