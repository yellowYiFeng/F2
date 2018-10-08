const getters = {
    width: state => state.global.width,
    region: state => state.regionPick.region,
    shop: state => state.regionPick.shop,
    group: state => state.regionPick.group,
    sales: state => state.regionPick.sales,
    pageType: state => state.regionPick.pageType,
    dateFrom: state => state.datePick.dateFrom,
    dateTo: state => state.datePick.dateTo,
    dateType: state => state.datePick.dateType,
}
export default getters
