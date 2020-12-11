const app = require('express')();
const cors = require('cors');
app.use(cors());
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: 'http://localhost:4200',
  }
});
const bodyParser = require('body-parser');
app.use(bodyParser.json());

const { shuffle } = require('./utils/helpers');
// import { shuffle } from './utils/helpers';

let currPlayer = 0;
const players = [];
const cards = [{
  url: '',
  number: 1
},{
  url: '',
  number: 2
},{
  url: '',
  number: 3
},{
  url: '',
  number: 4
},{
  url: '',
  number: 5
},{
  url: '',
  number: 6
},{
  url: '',
  number: 7
}];

const shuffledCards = shuffle(cards);

app.get('/', (req, res) => {
  res.send('<h1>Hey Socket.io</h1>');
});

io.on('connection', (socket) => {
  let user = socket.handshake.query.user;
  console.log(`a user connected ${user}`);
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  // On Draw we grab the next card and send it back to the FE
  socket.on('draw', (msg) => {
    const currentCard = shuffledCards.pop();
    socket.emit('currentCard', currentCard);
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
  res.json({
    index: players.length
  });
});

http.listen(3000, () => console.log('Listening on port 3000!'));