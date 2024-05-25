// routes/user.js
const express = require('express');
const router = express.Router();
const { findUserByUsername, updateUser } = require('../models/user');

router.post('/update', (req, res) => {
  const { username, additional_info } = req.body;

  findUserByUsername(username, (err, user) => {
    if (err) {
      return res.status(500).send('Database error');
    }
    if (!user) {
      return res.status(404).send('User not found');
    }

    updateUser(username, additional_info, (err, results) => {
      if (err) {
        return res.status(500).send('Error updating user information');
      }
      res.status(200).send('User information updated successfully');
    });
  });
});

module.exports = router;
