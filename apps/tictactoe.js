const express = require('express');
const router = express.Router();
const pusher = require('../helpers/pusher');

let games = {};

router.post('/api/tictactoe/join', function(req, res) {
  let response = {};
  let { name, game } = req.body;
  if (game && games.hasOwnProperty(game.toLowerCase())) {
    game = game.toLowerCase();
    if (!games[game].O) {
      games[game].O = name;
      response = games[game];
      response.marker = 'O';
      pusher.trigger('hamontjs', 'tictactoe-' + game, {
        O: name,
      });
    } else {
      games[game].observers.push(name);
      response = games[game];
      response.marker = null;
      pusher.trigger('hamontjs', 'tictactoe-' + game, {
        observer: name,
      });
    }
  } else {
    const gameId = game ? game.toLowerCase() : newGameId();
    games[gameId] = {
      gameId,
      X: name,
      O: null,
      grid: [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ],
      turn: 'X',
      observers: [],
    };

    response = games[gameId];
    response.marker = 'X';
  }

  res.json(response);
});

const newGameId = () =>
  Array(4)
    .fill(0)
    .map(() => Math.floor(Math.random() * 26 + 10).toString(36))
    .join('');

module.exports = router;
