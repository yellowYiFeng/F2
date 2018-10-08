<template>
    <div>
        <div class="filter-box">
            <region-picker v-on:changeRegion="changeRegion" ></region-picker>
             <div class="inline-picker height-fixed-pick">
                 <ul class="pick-list">
                     <li>
                        <group>
                            <popup-picker class="height-fixed-cell" :data="stageData" v-model="stageValue" value-text-align="left" :show-name="true" @on-change="changeStage"   :columns="stageData.length" :placeholder="placeholder" :disabled="isdisabled"></popup-picker>
                        </group>
                     </li>
                     <li>
                        <group>
                            <popup-picker class="height-fixed-cell" :data="detailData" v-model="detailValue"  value-text-align="left" :show-name="true" :columns="length" @on-change="changeDetailPick" placeholder="暂无权限查看" :disabled="isdisabled"></popup-picker>
                        </group>
                     </li>
                 </ul>
            </div>
            <date-time @ee="changeTime"></date-time>
        </div>
         <div class="filter-box">
             <div class="fl">{{title}}</div>
             <canvas id="detailChart"  v-bind:style="{width:$store.getters.width,height:'300px'}" ></canvas>
        </div>
        <div class="filter-box">
            <div class="tl ft14 detail-title">
                详细数据
            </div>
            <x-table full-bordered v-if="title != '车辆评估'">
                <thead>
                    <tr>
                        <th>日期</th>
                        <th>{{title}}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in tableData">
                        <td>{{item.date}}</td>
                        <td>{{item.value}}</td>
                    </tr>
                </tbody>
            </x-table>
             <x-table full-bordered v-else>
                <thead>
                    <tr>
                        <th>日期</th>
                        <th>系统评估</th>
                        <th>人工评估</th>
                        <th>总评估数</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in tableData">
                        <td>{{item.date}}</td>
                        <td>{{item.sysAssessCount}}</td>
                        <td>{{item.manualAssessCount}}</td>
                        <td>{{item.value}}</td>
                    </tr>
                </tbody>
            </x-table>
        </div>
    </div>
</template>
<script>
const F2 = require('@antv/f2');
import RegionPicker from '../../components/regionPicker'
import DateTime from '../../components/date.vue'
import {getStatsDetailNewApi,getUserRoleDataApi} from '../../service/getData'
import { dateFormat   } from 'vux'
import { setTimeout } from 'timers';
export default {

    data(){
        return{
            data: [], //图表数据
            tableData: [], //详细数据table
            stageData:[], //租赁阶段列表
            stageValue:[],   //租赁阶段值
            detailData: [], //详细筛选列表
            detailAllList: [], //详细筛选所有值 (所有租赁阶段下级的数据列表))
            detailValue:[], //详细筛选值
            title: "", //筛选标题
            allData: [],//整个详细数据图表所有数据
            requstObj: {}, //请求体
            chart: null,
            isFirstRender: true,
            tickCount: 9,
            length: 10,
            placeholder: "选择租赁阶段",
            isdisabled: false
        }
    },
    components:{
        RegionPicker,
        DateTime,
    },
    mounted(){
        this.getUserRoleData();
        // this.getStatsDetailNew();
    },
    methods:{
        //子组件修改区域回调事件
        changeRegion(){
            this.getStatsDetailNew();
        },
        //子组件修改时间回调事件
        changeTime(){
          this.getStatsDetailNew();
        },
        //修改租赁阶段获取下级列表
        changeStage(value){
            this.getNextPickData(value);
            this.detailValue = [this.detailData[0].value];
            this.changeDetailPick(this.detailValue);
        },
        getNextPickData(value){
            let list = [];
            this.detailAllList.forEach(item => {
                if(item.parentId == value[0]){
                    list.push({
                        name: item.name,
                        value: item.value
                    });
                }
            })
            this.detailData = list;
            this.length = list.length;
        },
        //修改详细筛选
        changeDetailPick(value){
            let type = "";
            switch(value[0]){
                case "进件数" : type = "newCount";break;
                case "合同签订数" : type = "contractOrderCount";break;
                case "抵押登记" : type = "mortgageOrderCount";break;
                case "GPS安装" : type = "gPSOrderCount";break;
                case "GPS安装数量" : type = "gPSInstallCount";break;
                case "成交量" : type = "doneCount";break;
                case "车辆评估" : type = "carAssessCount";break;
                case "成交率" : type = "doneRate";break;
                case "风险客户" : type = "riskCount";break;
                case "离线GPS数量" : type = "offlineGpsCount";break;
                case "在线GPS数量" : type = "onlineGpsCount";break;
                case "逾期订单" : type = "sumOverdues";break;
                case "客服催收" : type = "pressCount";break;
                case "上门催收" : type = "doorCollectCount";break;
                case "后勤拖车" : type = "trailerCount";break;
                case "应还款" : type = "shouldRepaymentAmount";break;
                case "实际收款金额" : type = "sumRepaymentAmount";break;
                case "放款金额" : type = "sumLoanMoney";break;
                case "结清" : type = "clearCount";break;
                case "逾期金额" : type = "sumRemainAmount";break;
            }
            this.title = value[0];
            let listObj = this.dealData(type);
            this.renderDetaiChart(listObj.chartList)
            this.renderDetailTable(listObj.tableList);
        },
        //获取租赁阶段
        getUserRoleData(){
            getUserRoleDataApi().then(res => {
                if(res.result.length == 0){
                    this.placeholder = "暂无查看权限";
                    this.isdisabled = true;
                    return false;
                }
                let detailAllList = [];
                res.result.forEach(item => {
                    this.stageData.push({
                        name: item.parent.fullName.replace(/统计/,''),
                        value: item.parent.homePageSettingBaseId
                    });
                    item.children.forEach(item2 => {
                        detailAllList.push({
                            name: item2.fullName,
                            parentId: item2.parentId,
                            value: item2.fullName
                        });
                    })
                })
                this.detailAllList = detailAllList;
                setTimeout(() => {
                    this.stageValue.push(res.result[0].parent.homePageSettingBaseId);
                    this.detailValue.push(res.result[0].children[0].fullName);
                    this.getStatsDetailNew();
                },300)
                
            })
        },
        //获取详细数据
        getStatsDetailNew: function(){
            let dateFrom = this.$store.getters.dateFrom, dateTo = this.$store.getters.dateTo;
            let pageType = this.$store.getters.pageType;
            let objectId = pageType ? this.$store.getters[pageType][0] : '';
            let dataType = this.$utils.compareDate(dateFrom,dateTo) == 0 ? "hour" : "date"; //同一天dataType为hour 否则为date
            this.requstObj = {
                DataType: dataType,
                DateFrom: dateFrom,
                DateTo: dateTo,
                ObjectId: objectId,
                PageType: pageType
            }
            this.$vux.loading.show({
                text: '加载中'
            })
            getStatsDetailNewApi(this.requstObj).then(res => {
                this.$vux.loading.hide();
                this.allData = res.result;
                this.tickCount = dataType == "hour" ? 9 : 10 ;
                this.getNextPickData(this.stageValue);
                this.changeDetailPick(this.detailValue);
            })
        },

        //处理数据
        dealData: function(type){
            let array = this.allData;
            let params = this.requstObj;
            let timeInterval = this.moment( params.DateTo).diff(params.DateFrom,"days") + 1;
            let listTemp = [],chartList = [], tableList = [];
            array.map(e => {
              listTemp.push({ date: e.createDate || e.createDateHour, value: e[type], sysAssessCount: e.sysAssessCount, manualAssessCount: e.manualAssessCount });
            })
            //时间范围内每天、每个时段若无数据记为0
            var endTime = params.DateTo;//.replace(/-/g, '/');
            if (params.DataType == 'date') {//近七天、三十天
              for (let i = 0; i < timeInterval ; i++) {
                var now = this.moment(endTime).subtract(i, 'days').format("YYYY-MM-DD");
                var tempData = listTemp.filter(function (tempItem, j) {
                  return  dateFormat(tempItem.date, 'YYYY-MM-DD')  == now; //日期或时段是否有数据
                });
                if (tempData.length > 0) {
                  chartList.push({date: dateFormat(tempData[0].date, 'M-DD') ,value: tempData[0].value});
                  tableList.push(tempData[0]);
                } else {
                  chartList.push({date: dateFormat(now, 'M-DD') ,value: 0}); //没数据记0
                  tableList.push({date: now ,value: 0,sysAssessCount: 0,manualAssessCount: 0}); //没数据记0
                }
              }
              chartList.reverse();
            } else {//昨天
                for(let i = 0;i<=24;i++){
                    var tempData = listTemp.filter(function (tempItem, j) {
                        var temp = tempItem.date.substr(tempItem.date.length-2);
                        return Number(temp) == i; //日期或时段是否有数据
                    });
                    if (tempData.length > 0) {
                        chartList.push({date: i + "时",  value: tempData[0].value });
                        tableList.push({date: this.moment(tempData[0].date).format('YYYY-MM-DD H') + '时', value: tempData[0].value,sysAssessCount:  tempData[0].sysAssessCount,manualAssessCount:  tempData[0].manualAssessCount });
                    } else {
                        chartList.push({date: i + "时",  value: 0 }); //没数据记0
                        tableList.push({date: endTime + ' ' + i + '时', value: 0,sysAssessCount: 0,manualAssessCount: 0 });
                    }
                }

            }
            return {chartList:chartList,tableList:tableList}
        },
        //渲染详细数据图表
        renderDetaiChart: function(data){
            if(this.chart){
                this.chart.clear();
            }
            this.chart = new F2.Chart({
                id: 'detailChart',
                pixelRatio: window.devicePixelRatio
            });
            this.chart.source(data, {
                value: {
                    min: 0,
                },
                date: {
                    type: 'cat',
                    range: [0,1],
                    tickCount: this.tickCount
                }
            });
            this.chart.tooltip({
                showItemMarker: false,
                onShow: function onShow(ev) {
                    var items = ev.items;
                    items[0].name = items[0].title;
                }
            });
            this.chart.axis('date', {
                line: {
                    lineWidth: 1,
                    stroke: '#ccc',
                    top: true, // 展示在最上层
                }, // 设置坐标轴线的样式，如果值为 null，则不显示坐标轴线，图形属性
                grid: (text, index, total) => {
                    return {stroke: '#ccc'}
                },
                label: (text, index, total) => {
                    return {
                        textAlign: 'center'
                    };
                }
            });
            this.chart.line().position('date*value');
            this.chart.render();
            this.isFirstRender = false;
        },
        changeChartData: function(data){
            this.chart.changeData(data);
        },
        //渲染详细数据表格
        renderDetailTable: function(data){
            this.tableData = data;
        }
    }
}
</script>

