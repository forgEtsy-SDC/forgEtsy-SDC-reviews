const express = require('express');
const app = express();
const cors = require('cors');

// Debugger
const debug = require('debug')('http');
debug('Booting up...');

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  debug(`${req.method} ${req.url}`);
  res.send('Hello World');
  debug(`Response: 'Hello World'`)
});

app.get('/database/seed', (req, res) => {
  debug(`${req.method} ${req.url}`);
  res.send('Seeding database...');
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
  debug(`Listening on port ${port}...`)
})