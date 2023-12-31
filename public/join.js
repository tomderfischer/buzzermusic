const socket = io()
const body = document.querySelector('.js-body')
const form = document.querySelector('.js-join')
const joined = document.querySelector('.js-joined')
const buzzer = document.querySelector('.js-buzzer')
const joinedInfo = document.querySelector('.js-joined-info')
const editInfo = document.querySelector('.js-edit')
const buzzed = document.querySelector('.js-buzzed')
const loginerror = document.querySelector('.js-loginerror')


var error_accured = 0
var join_return = ""
var buzzer_off = 0

let user = {}
let user_lastBuzzer = {}

const host_reaction = () => {
  buzzed.classList.add('hidden')
  joined.classList.remove('hidden')
  if (user_lastBuzzer.name == user.name){
    body.classList.replace('your-turn', 'buzzer-mode')
  }
  else{
    body.classList.replace('another-turn', 'buzzer-mode')
  }
}

const getUserInfo = () => {
  user = JSON.parse(localStorage.getItem('user')) || {}
  if (user.name) {
    form.querySelector('[name=buzzersound]').value = user.sound
    form.querySelector('[name=name]').value = user.name
  }
}
const saveUserInfo = () => {
  localStorage.setItem('user', JSON.stringify(user))
}

form.addEventListener('submit', (e) => {
  e.preventDefault()
  user.name = form.querySelector('[name=name]').value
  user.sound = form.querySelector('[name=buzzersound]').value
  user.id = Math.floor(Math.random() * new Date())
  socket.emit('join', user, (response) => {
    if (response == "ok") {
      saveUserInfo()
      form.classList.add('hidden')
      joined.classList.remove('hidden')
      body.classList.add('buzzer-mode')
      if (error_accured) loginerror.classList.add('hidden')
    }
    else {
      error_accured = 1
      join_return = response
      loginerror.classList.remove('hidden')
    }
  })
  saveUserInfo()
  joinedInfo.innerText = `Viel Spaß ${user.name}!`  
})

buzzer.addEventListener('click', (e) => {
  if (!buzzer_off) socket.emit('user_buzzer', user)
})

socket.on('server_buzzer', (user_buzzer) => { 
  getUserInfo()
  user_lastBuzzer = user_buzzer
  buzzed.classList.remove('hidden')
  joined.classList.add('hidden')
  if (user_buzzer.name == user.name){
    body.classList.replace('buzzer-mode', 'your-turn')
  }
  else{
    body.classList.replace('buzzer-mode', 'another-turn')
  }
})

socket.on('server_right', () => {
  host_reaction()
  if (buzzer_off) {
    buzzer_off = 0
    buzzer.classList.remove('hidden')
  }
})

socket.on('server_wrong', (user_buzzer) => {
  host_reaction()
  if (user_buzzer.name == user.name) {
    buzzer_off = 1
    joinedInfo.innerText = `Buzzer deaktiviert!`
  }
})

socket.on('server_reset_buzzers', () => {
  if (buzzer_off) {
    buzzer_off = 0
    joinedInfo.innerText = `Viel Spaß ${user.name}!`
  }
})

socket.on('server_newgame', () => {
  if (buzzer_off) {
    buzzer_off = 0
  }
  form.classList.remove('hidden')
  joined.classList.add('hidden')
  body.classList.remove('buzzer-mode')
  localStorage.removeItem("user")
})


editInfo.addEventListener('click', () => {
  joined.classList.add('hidden')
  form.classList.remove('hidden')
  body.classList.remove('buzzer-mode')
})

getUserInfo()
