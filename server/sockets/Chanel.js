const crypto = require('crypto')
const State = require('./State')

class Chanel {
  constructor(server) {
    this.id = crypto.randomBytes(16).toString('hex')
    this.clients = {}
    this.population = 0
    this.server = server
    this.state = new State(this)
  }
  emit(event, data) {
    Object.values(this.clients).forEach(socket => {
      socket.emit(event, data)
    })
  }
  join(socket) {
    socket.chanels[this.id] = this
    this.clients[socket.id] = socket
    this.population += 1
  }
  leave(socket) {
    delete socket.chanels[this.id]
    delete this.clients[socket.id]
    this.population -= 1
    if (!this.population) {
      delete this.server.chanels[this.id]
    }
  }
  destroy() {
    Object.keys(this.clients).forEach(socket => delete socket.chanels[this.id])
    delete this.server.chanels[this.id]
  }
}

module.exports = Chanel
