const express = require('express');
const router = express.Router();
const pusher = require('../helpers/pusher');

const messages = [];

router.post('/api/chatroom/auth', function(req, res) {
  var socketId = req.body.socket_id;
  var channel = req.body.channel_name;
  var presenceData = {
    user_id: Array(32)
      .fill(0)
      .map(() => Math.floor(Math.random() * 10))
      .join(''),
    user_info: {
      name: req.body.name,
    },
  };
  var auth = pusher.authenticate(socketId, channel, presenceData);
  res.send(auth);
});

router.get('/api/chatroom/messages', function(req, res) {
  res.json(messages);
});

router.post('/api/chatroom/message', function(req, res) {
  const message = {
    user: req.body.user,
    message: req.body.message,
    timestamp: Date.now(),
  };

  pusher.trigger('presence-hamontjs-chatroom', 'new-message', message);
  messages.push(message);

  res.send();
});

module.exports = router;
