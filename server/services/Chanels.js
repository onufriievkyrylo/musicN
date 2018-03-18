const sockets = require('../sockets')
const Token = require('../utils/Token')

class Chanels {
  static get(sid) {
    // TODO use sid after add private/public chanel logic
    const chanels = sockets.instance.chanels
    return chanels
  }
  static create(sid) {
    const chanel = sockets.instance.createChanel(sid)
    return new Token({ cid: chanel.id })
  }
  static connect(cid, sid) {
    try {
      const chanel = sockets.instance.getChanel(cid)
      const socket = sockets.instance.getSocket(sid)
      chanel.join(socket)
      return chanel.state
    } catch (err) {
      console.log(err)
    }
  }
  static destroy(cid) {
    // TODO after add chanel owner
  }
  static playlist(cid, playlist) {
    const chanel = sockets.instance.getChanel(cid)
    chanel.state.playlist = playlist
  }
  static play(cid, play) {
    const chanel = sockets.instance.getChanel(cid)
    chanel.state.play = play
  }
  static track(cid, track) {
    const chanel = sockets.instance.getChanel(cid)
    chanel.state.track = track
  }
  static rewind(cid, seconds) {
    const chanel = sockets.instance.getChanel(cid)
    chanel.state.seconds = seconds
  }
}

module.exports = Chanels
