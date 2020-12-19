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

let currPlayerIndex = 0;
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

// const shuffledCards = shuffle(cards);
const shuffledCards = [{
  url: '',
  number: 7
},{
  url: '',
  number: 3
},{
  url: '',
  number: 7
},{
  url: '',
  number: 3
},{
  url: '',
  number: 7
},{
  url: '',
  number: 3
},{
  url: '',
  number: 7
}];

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
    io.in('some room').emit('currentCard', currentCard);
  });

  socket.on('endTurn', () => {
    players.forEach(play => play.isGood = false);
    currPlayerIndex = currPlayerIndex < players.length-1 ? (currPlayerIndex + 1) : 0;
    io.in('some room').emit('nextPlayerTurn', players[currPlayerIndex]);
  });

  socket.on('choosePlayerBE', (player) => {
    io.in('some room').emit('choosePlayer', player);
  });

  socket.on('clickedSeven', (name) => {
    // Update player in players
    const newPlayers = players.map(player => {
      if (player.name == name) {
        player.isGood = true;
      }
      return player;
    });
      
    io.in('some room').emit('updatePlayers', players);
  });

  socket.on('addPlayer', (name) => {
    socket.join('some room');
    if (!players.find(kid => kid.name === name)) {
      players.push({ name });
    }
    io.in('some room').emit('playerAdded', {
      currentPlayer: players[currPlayerIndex],
      players
    });
  })
});

app.get('/api/', (req, res) => {
  console.log('here you go');
  res.json(players);
});

http.listen(3000, () => console.log('Listening on port 3000!'));