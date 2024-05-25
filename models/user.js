// models/user.js
const db = require('../db/connection');

const findUserByUsername = (username, callback) => {
  const query = 'SELECT * FROM users WHERE username = ?';
  db.execute(query, [username], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results[0]);
  });
};

const updateUser = (username, additionalInfo, callback) => {
  const query = 'UPDATE users SET additional_info = ? WHERE username = ?';
  db.execute(query, [additionalInfo, username], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
};

module.exports = { findUserByUsername, updateUser };

