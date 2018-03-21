
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
    this.on('play', data => {
      this.broadcast('play', data, data.cid)
    })
    this.on('push playlist', data => {
      this.broadcast('push playlist', data, data.cid)
    })
  }
  on(event, callback) {
    this.socket.on('message', json => {
      const data = JSON.parse(json)
      if (data[0] === event) {
        callback(data[1])
      }
    })
  }
  emit(event, data) {
    this.socket.send(JSON.stringify([event, data]))
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
