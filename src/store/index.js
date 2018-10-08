import Vue from 'vue'
import Vuex from 'vuex'
import global from './global'
import regionPick from './modules/regionPick'
import datePick from './modules/datePick'
import dayPick from './modules/dayPick'
import getters from './getters'

Vue.use(Vuex)
const store = new Vuex.Store({
    modules: {
        global,
        regionPick,
        datePick,
        dayPick
    },
    getters
})

export default store
