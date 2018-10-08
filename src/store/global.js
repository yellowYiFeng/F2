const global = {
    state: {
        width: ''
    },
    mutations: {
        SET_WIDTH: (state,width) => {
            state.width = width;
        }
    },
    actions: {
        setWidth({ commit }, width){
            commit('SET_WIDTH', width);
        }
    }
}

export default global