const socket = io()
const body = document.querySelector('.js-body')
const form = document.querySelector('.js-join')
const joined = document.querySelector('.js-joined')
const buzzer = document.querySelector('.js-buzzer')
const joinedInfo = document.querySelector('.js-joined-info')
const editInfo = document.querySelector('.js-edit')
const buzzed = document.querySelector('.js-buzzed')

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
    form.querySelector('[name=name]').value = user.name
    form.querySelector('[name=team]').value = user.team
  }
}
const saveUserInfo = () => {
  localStorage.setItem('user', JSON.stringify(user))
}

form.addEventListener('submit', (e) => {
  e.preventDefault()
  user.name = form.querySelector('[name=name]').value
  user.team = form.querySelector('[name=team]').value
  if (!user.id) {
    user.id = Math.floor(Math.random() * new Date())
  }
  socket.emit('join', user)
  saveUserInfo()
  joinedInfo.innerText = `${user.name} on Team ${user.team}`
  form.classList.add('hidden')
  joined.classList.remove('hidden')
  body.classList.add('buzzer-mode')
})

buzzer.addEventListener('click', (e) => {
  socket.emit('user_buzzer', user)
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
})

socket.on('server_wrong', () => {
  host_reaction()
})

socket.on('server_skip', () => {
  host_reaction()
})

editInfo.addEventListener('click', () => {
  joined.classList.add('hidden')
  form.classList.remove('hidden')
  body.classList.remove('buzzer-mode')
})

getUserInfo()
