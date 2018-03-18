const Server = require('./Server')

const instance = Symbol('instance')

module.exports = {
  create(server) {
    module[instance] = new Server(server)
  },
  get instance() {
    return module[instance]
  }
}
