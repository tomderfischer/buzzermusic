const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express();
const server = http.Server(app);
const io = socketio(server);

const title = 'Buffer Buzzer'

players =  new Set()

function player(name, id, sound) {
  this.name = name
  this.id = id
  this.sound = sound
  this.points = 0
}


app.use(express.static('public'))
app.set('view engine', 'pug')

app.get('/', (req, res) => res.render('index', { title }))
app.get('/host', (req, res) => res.render('host', { title }))


io.on('connection', (socket) => {
  socket.on('join', (user, callback) => {
    console.log(user)
    join_return = ""
    if (user.name == "") join_return = "invalid_name"
    if (user.sound == "") join_return = "invalid_sound"
    if (user.id == 0) join_return = "invalid_id"
    players.forEach(element => {
      if (element.name == user.name) join_return = "invalid_name"
      if (element.sound == user.sound) join_return = "invalid_sound"
      if (element.id == user.id) join_return = "invalid_id"
    });
    console.log(join_return)
    if (join_return == "") {
      join_return = "ok"
      players.add(new player(user.name, user.id, user.sound))
      console.log(`${user.name} has joined!`)
      players.forEach(element => {
        console.log(element)
      })
    }
    callback(join_return)
  })

  socket.on('user_buzzer', (user) => {
    io.emit('server_buzzer', user)
    console.log(`${user.name} buzzed in!`)
  })

  socket.on('host_right', () => {
    io.emit('server_right')
    console.log(`Antwort war richtig`)
  })

  socket.on('host_wrong', () => {
    io.emit('server_wrong')
    console.log(`Antwort war falsch`)
  })

  socket.on('host_skip', () => {
    io.emit('server_skip')
    console.log(`Nächstes Lied`)
  })




})

server.listen(8090, () => console.log('Server started! Listening on 8090'))
