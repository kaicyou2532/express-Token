// models/user.js
const db = require('../db/connection');

const createUser = (username, password, email, callback) => {
  const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
  db.execute(query, [username, password, email], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results);
  });
};

module.exports = { createUser };
