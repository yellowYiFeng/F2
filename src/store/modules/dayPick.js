const dayPick = {
    state: {
        day: '2018-9-12',
    },
    mutations: {
        SET_DAY: (state,day) => {
            state.dateFrom = day;
        },
        SET_ALL: (state,data) => {
            state.day = [data.day];
        }
    },
    actions: {
        setDay({ commit }, day){
            commit('SET_DAY', day)
        },
        setAll({ commit }, data){
            commit('SET_ALL', data)
        },
    }
}

export default dayPick