import moment from 'moment'
const datePick = {
    state: {
        dateTo:  moment().subtract(1,'days').format('YYYY-MM-DD'),
        dateFrom:moment().subtract(1,'days').format('YYYY-MM-DD'),
        dateType: '',
        btnIndex:0,
    },
    mutations: {
        SET_DATEFROM: (state,dateFrom) => {
            state.dateFrom = dateFrom;
        },
        SET_DATETO: (state,dateTo) => {
            state.dateTo = dateTo;
        },
        SET_ALL: (state,data) => {
            state.dateFrom = [data.dateFrom];
            state.dateTo = [data.dateTo];
        },
        SET_DATETYPE: (state,dateType) => {
            state.dateType = dateType;
        },
        SET_BTNINDEX:(state,btnIndex) =>{
            state.btnIndex = btnIndex;
        }
    },
    actions: {
        setDateFrom({ commit }, dateFrom){
            commit('SET_DATEFROM', dateFrom)
        },
        setDateTo({ commit }, dateTo){
            commit('SET_DATETO', dateTo)
        },
        setAll({ commit }, data){
            commit('SET_ALL', data)
        },
        setDateType({ commit }, dateType){
            commit('SET_DATETYPE', dateType)
        },
        setBtnIndex({commit},btnIndex){
            commit('SET_BTNINDEX', btnIndex)
        }
    }
}

export default datePick