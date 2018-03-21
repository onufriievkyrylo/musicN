import Vue from 'vue'
import eio from 'engine.io-client'
import { headers } from './axios'

// const API_URL = location.origin.replace(/^http/, 'ws')

// const opts = {
//   extraHeaders: {
//   }
// }

const socket = eio()

socket.on('open', () => {
  headers({
    sid: socket.id
  })
})
socket.on('error', err => {
  console.error('error', err)
})

export function connect() {
  socket.open()
}

export function disconnect() {
  socket.close()
}

export function on(event, callback) {
  socket.on('message', json => {
    const data = JSON.parse(json)
    if (data[0] === event) {
      callback(data[1])
    }
  })
}

export function emit(event, data) {
  data.timestamp = Date.now()
  socket.send(JSON.stringify([event, data]))
}

const VueSocket = {
  install(vue) {
    vue.prototype.$socket = { connect, disconnect, on, emit }
  }
}

Vue.use(VueSocket)
