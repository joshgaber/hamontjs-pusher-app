const express = require('express');
const router = express.Router();
const pusher = require('../helpers/pusher');

router.post('/api/jellybean/guess', function(req, res) {
  const { name, guess } = req.body;
  pusher.trigger('hamontjs', 'jellybean-guess', { name, guess });
  res.send();
});

router.post('/api/jellybean/results', function(req, res) {
  const { name, guess } = req.body;
  pusher.trigger('hamontjs', 'jellybean-winner', { name, guess });
  res.send();
});

module.exports = router;
