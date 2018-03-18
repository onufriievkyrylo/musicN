import Vue from 'vue'
import eio from 'engine.io-client'
import { headers } from './axios'

const API_URL = `ws://${process.env.HOST}:${process.env.PORT}/`

const opts = {
  extraHeaders: {
  }
}

const socket = eio(API_URL, opts)

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

const VueSocket = {
  install(vue) {
    vue.prototype.$socket = { connect, disconnect, on }
  }
}

Vue.use(VueSocket)
