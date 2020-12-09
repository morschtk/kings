const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const views_dir = path.join(__dirname, 'views');
const img_dir = path.join(__dirname, 'images');
app.use(express.static(views_dir));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(img_dir));

// Stupid browsers and stupid favicon requirments
app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/', (req, res) => res.redirect('/login'));
app.get('/login', (req, res) => res.sendFile(path.join(views_dir, 'login.html')));

app.listen(4200, () => console.log('Listening on port 4200!'));