const regionPick = {
    state: {
        region: [""],
        shop: [""],
        group: [""],
        sales: [""],
        pageType: ""
    },
    mutations: {
        SET_REGIN: (state,region) => {
            state.region = region;
        },
        SET_SHOP: (state,shop) => {
            state.shop = shop;
        },
        SET_GROUP: (state,group) => {
            state.group = group;
        },
        SET_SALES: (state,sales) => {
            state.sales = sales;
        },
        SET_PAGETYPE: (state,pageType) => {
            state.pageType = pageType;
        },
        CLEAR_LIST:  (state,list) => {
            list.forEach((item) => {
                state[item] = [""];
            })
        }
    },
    actions: {
        setRegion({ commit }, region){
            commit('SET_REGIN', region)
        },
        setShop({ commit }, shop){
            commit('SET_SHOP', shop)
        },
        setGroup({ commit }, group){
            commit('SET_GROUP', group)
        },
        setSales({ commit }, sales){
            commit('SET_SALES', sales)
        },
        setPageType({ commit }, pageType){
            commit('SET_PAGETYPE', pageType)
        },
        clearList({ commit }, list){
            commit('CLEAR_LIST', list)
        }
    }
}

export default regionPick