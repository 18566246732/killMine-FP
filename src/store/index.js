import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
    remainingBombs: 10,
    nextAction: 'start'
}

const mutations = {
    set_remainingBombs(state, remainingBombs) {
        state.remainingBombs = remainingBombs
    },
    set_nextAction(state, nextAction) {
        state.nextAction = nextAction
    }
}

export default new Vuex.Store({
    state,
    mutations
})