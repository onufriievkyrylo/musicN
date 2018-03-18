
class Socket {
  constructor(socket, server) {
    this.id = socket.id
    this.socket = socket
    this.chanels = {}
    this.server = server
    this.socket.on('close', () => {
      delete this.server.clients[socket.id]
      Object.values(this.chanels).forEach(chanel => {
        chanel.leave(this)
      })
    })
  }
  emit(event, data) {
    this.socket.send(JSON.stringify([
      event,
      data
    ]))
  }
  broadcast(event, data, to) {
    const clients = to ? this.chanels[to].clients : this.server.clients
    Object.values(clients).forEach(socket => {
      if (socket.id !== this.id) {
        socket.emit(event, data)
      }
    })
  }
  join(cid) {
    const chanel = this.server.getChanel(cid)
    chanel.join(this)
  }
  leave(cid) {
    const chanel = this.server.getChanel(cid)
    chanel.leave(this)
  }
  toJSON() {
    return {
      id: this.id
    }
  }
}

module.exports = Socket
