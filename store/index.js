import Vuex from 'vuex'

export default function () {
  return new Vuex.Store({
    state: {
      counter: 0
    },
    mutations: {
      increment(state) {
        state.counter++
      }
    }
  })
}
