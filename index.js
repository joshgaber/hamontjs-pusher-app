const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;

const Pusher = require('pusher');
const pusher = new Pusher({
  appId: '909292',
  key: '3d63639268dbf6809285',
  secret: 'fa823a3af22294eaf262',
  cluster: 'us2',
  useTLS: true,
});

app.use(cors());
app.use(bodyParser.json());

app.post('/api/jellybean/guess', function(req, res) {
  console.log(req);
  const { name, guess } = req.body;
  pusher.trigger('hamontjs', 'jellybean-guess', { name, guess });
  res.send();
});

app.post('/api/jellybean/results', function(req, res) {
  const { name, guess } = req.body;
  pusher.trigger('hamontjs', 'jellybean-winner', { name, guess });
  res.send();
});

app.get('/', (req, res) => {
  res.send({
    host: req.hostname,
    port: port,
  });
});

app.listen(port, () => console.log(`App is running on port ${port}!`));
