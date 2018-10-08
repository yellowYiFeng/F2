<template>
    <div>
        <div class="filter-box ">
            <region-picker v-on:changeRegion="changeRegion" ></region-picker>
        </div>
        <div class="filter-box">
            <grid :show-lr-borders="false" :show-vertical-dividers="false">
                <grid-item @click.native="changeTab(0)">
                    <div class="charts-item-box" :class="{active: active == 0}">
                        <div class="title">进件数</div>
                        <ul class="text-left">
                            <li class="organe charts-item-num">{{statsSummary.newCount}}单</li>
                            <li>日：{{statsSummary.newCountCPer | absValue | fixed}}% <em :class=" statsSummary.newCountCPer |  checkUpDown"></em></li>
                            <li>周：{{statsSummary.newCount7CPer | absValue | fixed}}% <em :class=" statsSummary.newCount7CPer |  checkUpDown"></em></li>
                            <li>月：{{statsSummary.newCount30CPer | absValue | fixed}}% <em :class=" statsSummary.newCount30CPer |  checkUpDown"></em></li>
                        </ul>
                    </div>
                </grid-item>
                <grid-item @click.native="changeTab(1)">
                    <div class="charts-item-box" :class="{active: active == 1}">
                        <div class="title">成交量</div>
                        <ul class="text-left">
                            <li class="organe charts-item-num">{{statsSummary.doneCount}}单</li>
                            <li>日：{{statsSummary.doneCountCPer | absValue | fixed}}% <em :class=" statsSummary.doneCountCPer |  checkUpDown"></em></li>
                            <li>周：{{statsSummary.doneCount7CPer | absValue | fixed}}% <em :class=" statsSummary.doneCount7CPer |  checkUpDown"></em></li>
                            <li>月：{{statsSummary.doneCount30CPer | absValue | fixed}}% <em :class=" statsSummary.doneCount30CPer |  checkUpDown"></em></li>
                        </ul>
                    </div>
                </grid-item>
                <grid-item @click.native="changeTab(2)">
                    <div class="charts-item-box" :class="{active: active == 2}">
                        <div class="title">放款数</div>
                        <ul class="text-left">
                            <li class="organe charts-item-num">{{statsSummary.sumLoanMoney}}单</li>
                            <li>目标完成情况</li>
                            <li>周：{{statsSummary.monthTargetRate | absValue | fixed}}% <em :class=" statsSummary.monthTargetRate |  checkUpDown"></em></li>
                            <li>月：{{statsSummary.yearTargetRate | absValue | fixed}}% <em :class=" statsSummary.yearTargetRate |  checkUpDown"></em></li>
                        </ul>
                    </div>
                </grid-item>
            </grid>
        </div>
        <div class="filter-box">
            <canvas id="yeaterdayChart" v-bind:style="{width:$store.getters.width,height:'300px'}"></canvas>
        </div>
    </div>
</template>

<script>
    const F2 = require('@antv/f2');
    import { PopupPicker, VChart, VLine } from 'vux'
    import RegionPicker from '../../components/regionPicker'
    import {getStatsSummaryNewApi,getStatsDetailNewApi} from '../../service/getData'
    export default {
        components: {
            PopupPicker,
            VChart, 
            VLine,
            RegionPicker
        },
        data(){
            return {
                active: 0,
                statsSummary: {},
                data: [],
                count: 0,//count计数器 表示是否已经拿到昨日 今日 上周同期数据
                chart: null,//昨日概况图表
                isFirstRender: true //是否是第一次渲染图表
            }
        },
        mounted(){
            this.getStatsSummaryNew({});
            this.getThreeStatsDetail();
        },
        methods: {
            //获取昨日 今日 上周同期数据
            getThreeStatsDetail: function(){
                this.count = 0;
                this.data = [];
                this.getStatsDetailNew("yesterday");//昨日
                this.getStatsDetailNew("today");//今日
                this.getStatsDetailNew("sevenAgo");//上周同期数据
            },
            //获取进件数 成交量 放款数
            getStatsSummaryNew: function(){
                let date = this.$utils.getAgoDate(1);
                let pageType = this.$store.getters.pageType;
                let objectId = pageType ? this.$store.getters[pageType][0] : '';
                let params = {
                    DateFrom: date,
                    DateTo: date,
                    ObjectId: objectId,
                    PageType: pageType
                }
                getStatsSummaryNewApi(params).then(res => {
                    this.statsSummary = res.result;
                })
            },
            //子组件修改区域事件
            changeRegion: function(){
                this.getStatsSummaryNew();
                this.getThreeStatsDetail();
            },
            //切换进件数 成交量 放款数
            changeTab: function(index){
                this.active = index;
                let list = this.orderList();
                this.changeChartData(list);
            },
            //获取昨日概况统计图表数据
            getStatsDetailNew: function(time){
                let date = '';
                let type = '';
                switch(time){
                    case "yesterday" : date = this.$utils.getAgoDate(1);type = "昨日";break;
                    case "today" : date = this.$utils.getAgoDate(0);type = "今日";break;
                    case "sevenAgo" : date = this.$utils.getAgoDate(7);type = "上周同期";break;
                }
                let pageType = this.$store.getters.pageType;
                let objectId = pageType ? this.$store.getters[pageType][0] : '';
                let params = {
                    DataType: 'hour',
                    DateFrom: date,
                    DateTo: date,
                    ObjectId: objectId,
                    PageType: pageType
                }
                
                getStatsDetailNewApi(params).then(res => {
                    res = res.result;
                    let data = this.detalData(res,type);
                    data.forEach(item => {
                        this.data.push(item);
                    })
                    this.prewRenderChart();
                })
            },
            //将数据处理成["date": "时间","type": "类型(昨日 今日 上周同期)","newCount": "进件数","doneCount": "成交量","sumLoanMoney": "放款数"]的格式
            detalData: function(data,type){
                    let list = []
                    for(let i = 0;i <= 24;i++){
                        let hour = i < 10 ? "0" + i : i;
                        list.push({"date": hour + "时","type": type,"newCount": 0,"doneCount": 0,"sumLoanMoney": 0});
                    }
                    list.forEach(li => {
                        data.forEach(item => {
                            let time = item.createDateHour.substr(item.createDateHour.length-2) + "时";
                            if(li.date == time){
                                li.newCount = item.newCount;
                                li.doneCount = item.doneCount;
                                li.sumLoanMoney = item.sumLoanMoney;
                            }
                        });
                    })
                return list;
            },
            //根据现在所选择的类型(进件数/成交量/放款数) 将数据处理成需要图表需要显示的数据格式 ["date": "时间","type": "类型(昨日 今日 上周同期)","value":显示值]
            getChartData: function(){
                let countType = '';
                switch(this.active){
                    case 0: countType = "newCount";break;
                    case 1: countType = "doneCount";break;
                    case 2: countType = "sumLoanMoney";break;
                }
                let list = [];
                this.data.forEach(item => {
                    list.push({"date": item.date,"type": item.type,value:item[countType]});
                })
                return list;
            },
            //将数组按照今日 昨日 上周同期的顺序组装(解决调取三次接口数据异步获取，每次数据顺序随机问题)
            orderList: function(){
                let todayList = [],yesterdayList = [], weekList = [];
                this.getChartData(this.data).forEach(item => {
                    if(item.type == '今日'){
                        todayList.push(item);
                    }else if(item.type == '昨日'){
                        yesterdayList.push(item);
                    }else{
                        weekList.push(item);
                    }
                })
                let list = todayList.concat(yesterdayList,weekList);
                return list;
            },
            //渲染图表前预处理
            prewRenderChart: function(){
                this.count ++;
                //count == 3 表示今日 昨日 上周同期数据都已经拿到 然后才开始渲染图表
                if(this.count == 3){
                    let list = this.orderList();
                    //如果是第一次渲染图表 则调用render方法 否则只需要changeData即可
                    this.isFirstRender ? this.renderChart(list) : this.changeChartData(list);
                }
            },
            //渲染图表
            renderChart: function(data){
                this.chart = new F2.Chart({
                    id: 'yeaterdayChart',
                    pixelRatio: window.devicePixelRatio
                });
                this.chart.source(data);
                this.chart.scale('date', {
                    type: 'cat',
                    tickCount: 9
                });
                this.chart.axis('date', {
                    grid: (text, index, total) => {
                        return {stroke: '#ccc'}
                    },
                    label: function label(text, index, total) {
                        return {textCfg: 'center'};
                    }
                });
                this.chart.line().position('date*value').color('type');
                this.chart.render();
                this.isFirstRender = false;
            },
            changeChartData: function(data){
                this.chart.changeData(data);
            }
        }
    }
</script>