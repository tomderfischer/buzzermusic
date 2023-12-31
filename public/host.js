const socket = io()
const active = document.querySelector('.js-active')
const buzzList = document.querySelector('.js-buzzes')
const right = document.querySelector('.js-right')
const wrong = document.querySelector('.js-wrong')
const skip = document.querySelector('.js-skip')
const newgame = document.querySelector('.js-newgame')

sounds = new Set()

function new_sound(name, pfad) {
  this.name = name
  this.audio = new Audio(pfad)
}

sounds.add(new new_sound('aww', './sounds/Awwww.mp3'))
sounds.add(new new_sound('bruh', './sounds/Bruh.mp3')) 
sounds.add(new new_sound('buzzer', './sounds/Buzzer.mp3')) 
sounds.add(new new_sound('delfin', './sounds/Delfin.mp3')) 
sounds.add(new new_sound('error', './sounds/Error.mp3')) 
sounds.add(new new_sound('fart', './sounds/Fart.mp3')) 
sounds.add(new new_sound('feuerball', './sounds/Feuerballbamm.mp3')) 
sounds.add(new new_sound('haltsmaul', './sounds/Haltsmaul.mp3')) 
sounds.add(new new_sound('jaegermeister', './sounds/Jaegermeister.mp3')) 
sounds.add(new new_sound('okletsgo', './sounds/Okayletsgo.mp3')) 
sounds.add(new new_sound('pew', './sounds/Pew.mp3')) 
sounds.add(new new_sound('punch', './sounds/Punch.mp3')) 
sounds.add(new new_sound('quak', './sounds/Quak.mp3')) 
sounds.add(new new_sound('quietsch', './sounds/Quietscheente.mp3')) 
sounds.add(new new_sound('sui', './sounds/Suiiiiiiii.mp3')) 
sounds.add(new new_sound('wow', './sounds/WOW.mp3')) 
sounds.add(new new_sound('yippie', './sounds/Yippie.mp3')) 

//const testsound = new Audio('./sounds/WOW.mp3')


socket.on('active', (numberActive) => {
  active.innerText = `${numberActive} joined`
})

right.addEventListener('click', () => {
  socket.emit('host_right')
})

wrong.addEventListener('click', () => {
  socket.emit('host_wrong')
})

skip.addEventListener('click', () => {
  socket.emit('host_skip')
})

newgame.addEventListener('click', () => {
  socket.emit('host_newgame')
})

socket.on('server_buzzer', (user) => { 
  sounds.forEach(element => {
    if (element.name == user.sound) element.audio.play()
  });
})

