const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

const jellybean = require('./apps/jellybean');
const tictactoe = require('./apps/tictactoe');

const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(jellybean);
app.use(tictactoe);

app.get('/', (req, res) => {
  res.send({
    host: req.hostname,
    port: port,
  });
});

app.listen(port, () => console.log(`App is running on port ${port}!`));
