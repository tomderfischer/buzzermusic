const socket = io()
const active = document.querySelector('.js-active')
const buzzList = document.querySelector('.js-buzzes')
const right = document.querySelector('.js-right')
const wrong = document.querySelector('.js-wrong')
const skip = document.querySelector('.js-skip')

const audio_wow = new Audio('./sounds/WOW.mp3')


socket.on('active', (numberActive) => {
  active.innerText = `${numberActive} joined`
})

//socket.on('buzzes', (buzzes) => {
//  buzzList.innerHTML = buzzes
//    .map(buzz => {
//      const p = buzz.split('-')
//      return { name: p[0], team: p[1] }
//    })
//    .map(user => `<li>${user.name} on Team ${user.team}</li>`)
//    .join('')
//})

right.addEventListener('click', () => {
  socket.emit('host_right')
})

wrong.addEventListener('click', () => {
  socket.emit('host_wrong')
})

skip.addEventListener('click', () => {
  socket.emit('host_skip')
})

socket.on('server_buzzer', () => { 
  audio_wow.play()
})

