const engine = require('engine.io')
const Socket = require('./Socket')
const Chanel = require('./Chanel')

class Server {
  constructor(http) {
    this.clients = {}
    this.chanels = {}
    this.server = engine.attach(http)
    this.server.on('connection', socket => {
      const client = new Socket(socket, this)
      client.emit('hello', { grettings: 'hello world!' })
      this.clients[socket.id] = client
    })
  }
  emit(event, data) {
    Object.values(this.server.clients).forEach(socket => {
      socket.emit(event, data)
    })
  }
  getSocket(sid) {
    const socket = this.clients[sid]
    if (socket) {
      return socket
    } else {
      throw Error('Socket not found!')
    }
  }
  getChanel(cid) {
    console.log(cid)
    const chanel = this.chanels[cid]
    if (chanel) {
      return chanel
    } else {
      throw Error('Chanel not found!')
    }
  }
  createChanel(sid) {
    const socket = this.getSocket(sid)
    const chanel = new Chanel(this)
    this.chanels[chanel.id] = chanel
    socket.broadcast('new chanel', chanel)
    return chanel
  }
}

module.exports = Server
