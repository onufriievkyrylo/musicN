const symbols = {
  playlist: Symbol('playlist'),
  play: Symbol('play'),
  track: Symbol('track'),
  seconds: Symbol('seconds')
}

class State {
  constructor(chanel) {
    this.chanel = chanel
  }
  set playlist(playlist) {
    this[symbols.playlist] = playlist
    console.log(playlist)
    this.chanel.emit('update playlist', playlist)
  }
  set play(play) {
    this[symbols.play] = play
    this.chanel.emit('play', play)
  }
  set track(track) {
    this[symbols.track] = track
    this.chanel.emit('change track', track)
  }
  set seconds(seconds) {
    this[symbols.seconds] = seconds
    this.chanel.emit('rewind', seconds)
  }
  toJSON() {
    return {
      playlist: this[symbols.playlist],
      play: this[symbols.play],
      track: this[symbols.track],
      seconds: this[symbols.seconds]
    }
  }
}

module.exports = State
