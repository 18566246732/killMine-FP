import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    remainingBombs: 10,
    currentState: 'end'
}

const mutations = {
    set_remainingBombs(state, remainingBombs) {
        state.remainingBombs = remainingBombs
    },
    set_currentState(state, currentState) {
        state.currentState = currentState
    }
}

export default new Vuex.Store({
    state,
    mutations
})