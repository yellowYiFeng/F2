import request from '../service/http'

const getRoleLevel = function(data){
    return request({
        url: '/DataStats/GetUserRoleLevel',
        method: 'POST',
        data
    })
}
const getSexChart = function(data){
    return request({
        url: '/DataStats/GetCommonStatsData',
        method: 'POST',
        data
    })
}
const getTopChart = function(data){
    return request({
        url: '/DataStats/GetStatsDetailNew',
        method: 'POST',
        data
    })
}
//获取门店api
const getRegionApi = function(){
    return request({
        url: '/DataStats/GetUserDefaultAreaList',
        method: 'POST',
    })
}
//获取门店下级api
const getSubRegionApi = function(data){
    return request({
        url: '/DataStats/GetAreaByParent',
        method: 'POST',
        data
    })
}
// 获取业务统计概况数据
const getStatsSummaryNewApi = function(data){
    return request({
        url: '/DataStats/GetStatsSummaryNew',
        method: 'POST',
        data
    })
}

//获取业务统计详情数据
const getStatsDetailNewApi = function(data){
    return request({
        url: '/DataStats/GetStatsDetailNew',
        method: 'POST',
        data
    })
}
//获取租赁阶段权限
const getUserRoleDataApi = function(){
    return request({
        url: '/DataStats/GetUserRoleData',
        method: 'post',
    })
}
export{
    getRoleLevel,
    getSexChart,
    getTopChart,
    getRegionApi,
    getSubRegionApi,
    getStatsSummaryNewApi,
    getStatsDetailNewApi,
    getUserRoleDataApi
}