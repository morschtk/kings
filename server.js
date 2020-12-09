const app = require('express')();
var cors = require('cors');
app.use(cors());
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:4200',
  }
});
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const players = [];

app.get('/', (req, res) => {
  res.send('<h1>Hey Socket.io</h1>');
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.get('/api/', (req, res) => {
  console.log('here you go');
  res.json(players);
});

app.post('/api/add-to-game', (req, res) => {
  console.log('added!');
  const user = req.body.user;
  players.push(user);
  res.json(`${user} added`);
});

http.listen(3000, () => console.log('Listening on port 3000!'));