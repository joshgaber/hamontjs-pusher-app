const express = require('express')
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('static'));

app.post('/api/guess', function(req, res) {

});

app.post('/api/results', function(req, res) {

});

app.get('/', (req, res) => {
    res.send('Test');
});

app.listen(port, () => console.log(`App is running on port ${port}!`));
