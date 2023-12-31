const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express();
const server = http.Server(app);
const io = socketio(server);

var server_state = "initialising"
var active_player = ""

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
    if (server_state != "initialising") join_return = "game_in_progress"
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
    if (server_state == "playing") {
      server_state = "buzzed"
      active_player = user
      io.emit('server_buzzer', user)
      console.log(`${user.name} buzzed in!`)
    }
  })

  socket.on('host_right', () => {
    if (server_state == "buzzed") {
      players.forEach(element => {
        if (element.name == active_player.name) element.points++;
      });
      io.emit('server_right') 
      active_player = ""
      console.log(`Antwort war richtig`)
      server_state = "playing"
    }
  })

  socket.on('host_wrong', () => {
    if (server_state == "buzzed") {
      server_state = "playing"
      io.emit('server_wrong', active_player)
      active_player = ""
      console.log(`Antwort war falsch`)
    }
  })

  socket.on('host_skip', () => {
    if (server_state == "playing") {
      io.emit('server_reset_buzzers')
      console.log(`Reset Buzzers`)
    }
  })

  socket.on('host_newgame', () => {
    console.log("new game pressed")
    if (server_state == "playing") {
      io.emit('server_newgame')
      players.forEach(element => {
        players.delete(element)
      });
      server_state = "initialising"
      console.log(`start new game`)
    }
    else if (server_state == "initialising") {
      server_state = "playing"
      io.emit('server_startgame')
      console.log(`game started`)
    }
  })



})

server.listen(8090, () => console.log('Server started! Listening on 8090'))
