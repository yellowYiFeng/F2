<template>
    <div>
        <div class="filter-box ">
            <date-time @ee="getTopCharts"></date-time>
        </div>
        <div class="filter-box ">
            <div class="small-tab">
                <tab :line-width=1 active-color='#4e8dee' v-model="tabIndex" custom-bar-width="20px">
                    <tab-item class="vux-center" :selected="tabSelected === index" v-for="(item, index) in list" @click.native="changeType(index,item.type)" :key="index">{{item.name}}</tab-item>
                </tab>
            </div>
            <div>
                <!-- 门店TOP -->
                <div v-show="tabIndex == 0 && (roleLevel < 3||roleLevel == 3)" >
                    <canvas id="shopTop" v-bind:style="{width:$store.getters.width,height:'300px'}"></canvas>
                </div>
                <!-- 团队 -->
                <div v-show="tabIndex == 1 && (roleLevel < 4||roleLevel == 4)" >
                    <canvas id="team" v-bind:style="{width:$store.getters.width,height:'300px'}"></canvas>
                </div>
                <!-- 排行榜 -->
                <div v-show="tabIndex == 2 && (roleLevel < 5||roleLevel == 5)" @click="tabIndex = 2">
                   <canvas id="salesCavas" v-bind:style="{width:$store.getters.width,height:'300px'}"></canvas>
                </div>
                
            </div>
        </div>
    </div>
</template>

<script>
import DateTime from '../../components/date'
import {getTopChart} from '../../service/getData.js'
import utils from '../../util/utils';
const F2 = require('@antv/f2');
export default {
  data() {
    return {
        tabIndex: 0,
        tabSelected: 0,
        currentType:'shop',
        list:[{name:'门店TOP',type:'shop'},{name:'团队',type:'group'},{name:'排行榜',type:'sales'}],
        coord: {transposed: true},
        shopData: [],
        teamData: [],
        salesData:[],
        roleLevel : localStorage.getItem('level'),
        shopChart:null,
        teamChart:null,
        salesChart:null
    }
  },
  components:{
      DateTime
  },
  mounted() {
     this.getTopCharts();
  },
  methods: {
      changeType(index,type){
          this.tabSelected = index;
          this.currentType =  type;
          this.getTopCharts();
      },
      getTopCharts(){
          let data = {
                DataType:this.currentType,
                DateFrom:this.$store.state.datePick.dateFrom,
                DateTo:this.$store.state.datePick.dateTo,
          }
          let type = this.currentType;
          getTopChart(data).then(res => {
              let result = this.$utils.sortArray(res.result, 'doneCount').slice(-10);//从小到大排序 取后十个
              if(type == 'shop'){
                    this.shopData = this.$utils.getTopCavasData(result,type);
                    this.getShopTop();
              }else if(type == 'group'){
                    this.teamData = this.$utils.getTopCavasData(result,type);
                    this.getTeam();
              }else if(type == 'sales'){
                    this.salesData = this.$utils.getTopCavasData(result,type);
                    this.getSales();
              }
          })
      },
      getShopTop(){
        var Global = F2.Global;
        let that = this;
        if(this.shopChart){
            this.shopChart.clear();
        }
        this.shopChart= new F2.Chart({
            id: 'shopTop',
            pixelRatio: window.devicePixelRatio,
            padding:['auto' ,40, 'auto', 'auto']
        });
        var data = [];
        data = this.shopData;
        this.shopChart.source(data);
        this.shopChart.coord({
            transposed: true
        });
        this.shopChart.axis('doneCount', {
            line: Global._defaultAxis.line,
            grid: Global._defaultAxis.grid,
        });
        this.shopChart.axis('type', {
            line: Global._defaultAxis.line,
            grid: null,
            label: function(text, index, total){
                let name = "";
                data.forEach(item => {
                    if(item.type == text){
                        name = item.name ? item.name : '-' ;
                    }
                })
                return {text : name};
            }
        });
        this.shopChart.tooltip({
            onShow: function onShow(ev) {
                var items = ev.items;
                items[0].name = null;
                items[0].name = items[0].origin.name;
                items[0].value = items[0].value;
            },
        });
        this.shopChart.interval().position('type*doneCount').size('doneCount', z => {
            return 20;
        });
        // 绘制文本
        data.map(function(obj) {
            that.shopChart.guide().text({
                position: [obj.type, obj.doneCount],
                content: obj.doneCount,
                style: {
                textAlign: 'start'
                },
                offsetX: 10
            });
        });
        this.shopChart.render();
      },
      getTeam(){
        var Global = F2.Global;
        let that = this;
        if(this.teamChart){
            this.teamChart.clear();
        }
        this.teamChart = new F2.Chart({
            id: 'team',
            pixelRatio: window.devicePixelRatio,
            padding:['auto' ,40, 'auto', 'auto']
        });
        var data = [];
        data = this.teamData;
        this.teamChart.source(data);
        this.teamChart.coord({
            transposed: true
        });
        this.teamChart.axis('doneCount', {
            line: Global._defaultAxis.line,
            grid: Global._defaultAxis.grid,
        });
        this.teamChart.axis('type', {
            line: Global._defaultAxis.line,
            grid: null,
            label: function(text, index, total){
                let name = "";
                data.forEach(item => {
                    if(item.type == text){
                        name = item.name ? item.name : '-' ;
                    }
                })
                return {text : name};
            }
        });
        this.teamChart.tooltip({
            onShow: function onShow(ev) {
                var items = ev.items;
                items[0].name = null;
                items[0].name = items[0].origin.name;
                items[0].value = items[0].value;
            },
        });
        this.teamChart.interval().position('type*doneCount').size('doneCount', z => {
            return 20;
        });
        data.map(function(obj) {
            that.teamChart.guide().text({
                position: [obj.type, obj.doneCount],
                content: obj.doneCount,
                style: {
                textAlign: 'start'
                },
                offsetX: 10
            });
        });
        this.teamChart.render();
      },
      getSales(){
        var Global = F2.Global;
        let that = this;
        if(this.salesChart){
            this.salesChart.clear();
        }
        this.salesChart = new F2.Chart({
            id: 'salesCavas',
            pixelRatio: window.devicePixelRatio,
            padding:['auto' ,40, 'auto', 'auto']
        });
        var data = [];
        data = this.salesData;
        this.salesChart.source(data);
        this.salesChart.coord({
            transposed: true
        });
        this.salesChart.axis('doneCount', {
            line: Global._defaultAxis.line,
            grid: Global._defaultAxis.grid,
        });
        this.salesChart.axis('type', {
            line: Global._defaultAxis.line,
            grid: null,
            label: function(text, index, total){
                let name = "";
                data.forEach(item => {
                    if(item.type == text){
                        name = item.name ? item.name : '-' ;
                    }
                })
                return {text : name};
            }
        });
        this.salesChart.tooltip({
            onShow: function onShow(ev) {
                var items = ev.items;
                items[0].name = null;
                items[0].name = items[0].origin.name;
                items[0].value = items[0].value;
            },
        });
        data.map(function(obj) {
            that.salesChart.guide().text({
                position: [obj.type, obj.doneCount],
                content: obj.doneCount,
                style: {
                textAlign: 'start'
                },
                offsetX: 10
            });
        });
        this.salesChart.interval().position('type*doneCount').size('doneCount', z => {
                return 20;
            });
        this.salesChart.render();
      }
  }
}
</script>

