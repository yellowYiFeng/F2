<template>
    <div>
        <div class="filter-box">
            <div class="tl">
                <button v-for="(item,index) in filterList" :class="filterIndex === index ? 'activityBtn' :''" @click="filterIndex = index" class="filter-btn">{{item}}</button>
            </div>
            <date-time @ee="getUserCharts"></date-time>
            <div class="tl">
                <span class="ft14">客户类型：</span>
                <x-button mini v-for="(item,index) in dealList" :class="dealIndex === index ? 'activityBtn' :''" @click.native="changeState(index)">{{item}}</x-button>
            </div>
        </div>
        <!-- 年龄性别 -->
        <div class="filter-box" v-show="filterIndex === 0">
            <div class="small-tab">
                <tab v-model="index" custom-bar-width="20px" active-color='#4e8dee' :line-width=1>
                    <tab-item v-for="(item,index) in tabList" :selected="selected === index" @click.native="selected == index">{{item}}</tab-item>
                </tab>
            </div> 
            <div>
                <div v-show="index == 0" >
                    <!-- 年龄 -->
                    <canvas id="ageCavas" v-bind:style="{width:$store.getters.width,height:'300px'}"></canvas>
                    <div class="filter-box">
                        <x-table full-bordered class="ageTable">
                            <thead>
                                <tr>
                                    <th>日期</th>
                                    <th>年龄段</th>
                                    <th>总数</th>
                                    <th>占比</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in ageData">
                                    <td>{{dateFrom}}至{{dateTo}}</td>
                                    <td>{{item.dataGroupName}}</td>
                                    <td>{{item.typeCount}}</td>
                                    <td>{{item.typeRate}}%</td>
                                </tr>
                            </tbody>
                        </x-table>
                    </div>
                </div>
                <div v-show="index == 1">
                    <!-- 性别 -->
                    <canvas v-bind:style="{width:$store.getters.width,height:'300px'}" id="sexsCavas"></canvas>
                </div>
            </div>
        </div>
        <!-- 车型品牌 -->
        <div class="filter-box" v-show="filterIndex === 1">
            <canvas id="brandCavas" v-bind:style="{width:$store.getters.width,height:'300px'}"></canvas>
        </div>
        <!-- 省份城市 -->
        <div class="filter-box" v-show="filterIndex === 2">
            <canvas id="regionCavas" v-bind:style="{width:$store.getters.width,height:'300px'}"></canvas>
        </div>
        <!-- 租赁金额 -->
        <div class="filter-box" v-show="filterIndex === 3">
            <canvas id="borrowCavas" v-bind:style="{width:$store.getters.width,height:'300px'}"></canvas>
        </div>
    </div>
</template>
<script>
import DateTime from '../../components/date.vue'
import {getSexChart} from '../../service/getData.js'

const F2 = require('@antv/f2');
export default {
    data(){
        return{
            filterIndex:0,
            filterList:['年龄性别','车型品牌','省份城市','租赁金额'],
            selected:0, 
            tabList:['年龄','性别'],
            dealIndex:0,
            dealList:['全部','已成交'],
            index:0,
            dateFrom: this.$store.getters.dateFrom,
            dateTo: this.$store.getters.dateTo,
            rolelevel:localStorage.getItem('level'),
            ageData: [],
            sexData:[],
            carData: [],
            regionData: [],
            borrowData: [],
            ageChart:null,
            borrowChart:null,
            regionChart:null,
            brandChart:null,
        }
    }, 
    components:{
        DateTime
    }, 
    mounted(){
        this.getUserCharts();//获取用户画像统计
    },
    methods:{
        getUserCharts(){
            let data = {
                DateFrom:this.$store.state.datePick.dateFrom,
                DateTo:this.$store.state.datePick.dateTo,
                State:this.dealIndex
            }
            this.dateFrom = data.DateFrom;
            this.dateTo = data.DateTo;
            getSexChart(data).then(res=>{
                var res = res.result;
                for(var i = 0;i<res.length;i++){
                    if(res[i].dataType == 'Age'){
                        this.ageData = res[i].dataDetail;
                        this.getageCavas();
                    }else if(res[i].dataType == 'Brand'){
                        this.carData = this.$utils.sortArray(res[i].dataDetail, 'typeRate');
                        this.getBrandChart();
                    }else if(res[i].dataType == 'Region'){
                        this.regionData = this.$utils.sortArray(res[i].dataDetail, 'typeRate');
                        this.getRegionChart();
                    }else if(res[i].dataType == 'Borrow'){
                        this.borrowData = res[i].dataDetail;
                        this.getBorrowCavas();
                    }else if(res[i].dataType == 'Sex'){
                        this.sexData = this.$utils.dealSexData(res[i].dataDetail);
                        this.setSexCavas();
                        
                    }
                }
            }).catch(error=>{
            })
        },
        changeState(index){
            this.dealIndex = index;
            this.getUserCharts();
        },
        setSexCavas(){// 性别
            let that = this;
            var data = this.sexData;
                var chart = new F2.Chart({
                    id: 'sexsCavas',
                    pixelRatio: window.devicePixelRatio
                });

            chart.source(data);
            chart.coord('polar', {
                transposed: true,
                innerRadius: 0.4,
                radius: 0.85
            });
            chart.axis(false);
            chart.legend(false);
            chart.tooltip(false);
            chart.legend({
                position: 'top',
                itemFormatter: function itemFormatter(val) {
                    var mapVal = that.dealPercent(that.sexData,val);
                    return val + '' + mapVal[val];
                }
            });
            chart.interval().position('namekey*ratio').color('memo', [ '#4e8dee', '#ff6600' ]).adjust('stack');
            chart.render();
            // >>>>>>>>>>>>>>>>>>>>>>>>> labeling <<<<<<<<<<<<<<<<<<<<<<<<<<
            var ANCHOR_OFFSET = 5;
            var OFFSET = 15;
            var APPEND_OFFSET = 30;
            var LINEHEIGHT = 32;
            var coord = chart.get('coord'); // 获取坐标系对象
            var center = coord.center; // 极坐标圆心坐标
            var r = coord.circleRadius; // 极坐标半径
            var canvas = chart.get('canvas');
            var canvasWidth = chart.get('width');
            var canvasHeight = chart.get('height');
            var labelGroup = canvas.addGroup();
            var labels = [];

            function getEndPoint(center, angle, r) {
            return {
                x: center.x + r * Math.cos(angle),
                y: center.y + r * Math.sin(angle)
            };
            }
            // 绘制文本以及连接线
            function drawLabel(label) {
            var _data = label._data,
                _anchor = label._anchor,
                _router = label._router,
                fill = label.fill,
                y = label.y;

            var labelAttrs = {
                y: y,
                fontSize: 12, // 字体大小
                fill: '#808080',
                text: _data.memo + '\n' + _data.amount,
                textBaseline: 'middle'
            };
            var lastPoint = {
                y: y
            };
            if (label._side === 'left') {
                // 具体文本的位置
                lastPoint.x = APPEND_OFFSET;
                labelAttrs.x = APPEND_OFFSET; // 左侧文本左对齐并贴着画布最左侧边缘
                labelAttrs.textAlign = 'left';
            } else {
                lastPoint.x = canvasWidth - APPEND_OFFSET;
                labelAttrs.x = canvasWidth - APPEND_OFFSET; // 右侧文本右对齐并贴着画布最右侧边缘
                labelAttrs.textAlign = 'right';
            }
            // 绘制文本
            var text = labelGroup.addShape('Text', {
                attrs: labelAttrs
            });
            labels.push(text);
            // 绘制锚点
            labelGroup.addShape('Circle', {
                attrs: {
                x: _anchor.x,
                y: _anchor.y,
                r: 2,
                fill: fill
                }
            });
            // 绘制连接线
            var points = void 0;
            if (_router.y !== y) {
                // 文本位置做过调整
                points = [_anchor, {
                x: _router.x,
                y: y
                }, lastPoint];
            } else {
                points = [_anchor, _router, lastPoint];
            }

            labelGroup.addShape('Polyline', {
                attrs: {
                points: points,
                lineWidth: 1,
                stroke: fill
                }
            });
            }
            function antiCollision(half, isRight) {
            var startY = center.y - r - OFFSET - LINEHEIGHT;
            var overlapping = true;
            var totalH = canvasHeight;
            var i = void 0;
            var maxY = 0;
            var minY = Number.MIN_VALUE;
            var boxes = half.map(function(label) {
                var labelY = label.y;
                if (labelY > maxY) {
                maxY = labelY;
                }
                if (labelY < minY) {
                minY = labelY;
                }
                return {
                size: LINEHEIGHT,
                targets: [labelY - startY]
                };
            });
            if (maxY - startY > totalH) {
                totalH = maxY - startY;
            }

            while (overlapping) {
                boxes.forEach(function(box) {
                var target = (Math.min.apply(minY, box.targets) + Math.max.apply(minY, box.targets)) / 2;
                box.pos = Math.min(Math.max(minY, target - box.size / 2), totalH - box.size);
                });

                // detect overlapping and join boxes
                overlapping = false;
                i = boxes.length;
                while (i--) {
                if (i > 0) {
                    var previousBox = boxes[i - 1];
                    var box = boxes[i];
                    if (previousBox.pos + previousBox.size > box.pos) {
                    // overlapping
                    previousBox.size += box.size;
                    previousBox.targets = previousBox.targets.concat(box.targets);

                    // overflow, shift up
                    if (previousBox.pos + previousBox.size > totalH) {
                        previousBox.pos = totalH - previousBox.size;
                    }
                    boxes.splice(i, 1); // removing box
                    overlapping = true;
                    }
                }
                }
            }

            // step 4: normalize y and adjust x
            i = 0;
            boxes.forEach(function(b) {
                var posInCompositeBox = startY; // middle of the label
                b.targets.forEach(function() {
                half[i].y = b.pos + posInCompositeBox + LINEHEIGHT / 2;
                posInCompositeBox += LINEHEIGHT;
                i++;
                });
            });

            // (x - cx)^2 + (y - cy)^2 = totalR^2
            half.forEach(function(label) {
                var rPow2 = label.r * label.r;
                var dyPow2 = Math.pow(Math.abs(label.y - center.y), 2);
                if (rPow2 < dyPow2) {
                label.x = center.x;
                } else {
                var dx = Math.sqrt(rPow2 - dyPow2);
                if (!isRight) {
                    // left
                    label.x = center.x - dx;
                } else {
                    // right
                    label.x = center.x + dx;
                }
                }
                drawLabel(label);
            });
            }

            function addPieLabel(chart) {
            var halves = [[], // left
            [] // right
            ]; // 存储左右 labels
            labelGroup && labelGroup.clear();
            var geom = chart.get('geoms')[0];
            // 获取文本的信息
            var shapes = geom.get('container').get('children');
            shapes.forEach(function(shape) {
                var shapeAttrs = shape.attr();
                var origin = shape.get('origin');
                var startAngle = shapeAttrs.startAngle,
                endAngle = shapeAttrs.endAngle;

                var middleAngle = (startAngle + endAngle) / 2;
                var edgePoint = getEndPoint(center, middleAngle, r + ANCHOR_OFFSET);
                var routerPoint = getEndPoint(center, middleAngle, r + OFFSET);
                var label = {
                _anchor: edgePoint,
                _router: routerPoint,
                _data: origin._origin,
                x: routerPoint.x,
                y: routerPoint.y,
                r: r + OFFSET,
                fill: origin.color // 字体颜色
                };
                // 判断文本的方向
                if (edgePoint.x < center.x) {
                label._side = 'left';
                halves[0].push(label);
                } else {
                label._side = 'right';
                halves[1].push(label);
                }
            });

            var maxCountForOneSide = parseInt(canvasHeight / LINEHEIGHT, 10);

            halves.forEach(function(half, index) {
                // step 2: reduce labels
                if (half.length > maxCountForOneSide) {
                half.sort(function(a, b) {
                    return b._percent - a._percent;
                });
                half.splice(maxCountForOneSide, half.length - maxCountForOneSide);
                }

                // step 3: distribute position (x and y)
                half.sort(function(a, b) {
                    return a.y - b.y;
                });
                antiCollision(half, index);
                canvas.draw();
            });
            }
            addPieLabel(chart);

            // ================= 改变数据 ========================
            function randomData(data) {
            data.map(function(obj) {
                obj.ratio = Math.random();
                return obj;
            });
            return data;
            }
        },
        getBrandChart(){//车型品牌
            let that = this;
            let chartheight = this.carData.length*20 < 400 ? 300 : this.carData.length*30;
            var Global = F2.Global;
            var data = [];
            data = this.carData
            if(this.brandChart){
                this.brandChart.clear();
            }
            this.brandChart = new F2.Chart({
                id: 'brandCavas',
                pixelRatio: window.devicePixelRatio,
                height:chartheight,
                padding:['auto' ,40, 'auto', 'auto']
            });
            this.brandChart.source(data);
            this.brandChart.coord({
                transposed: true
            });
            this.brandChart.axis('dataGroupName', {
                line: Global._defaultAxis.line,
                grid: null
            });
            this.brandChart.axis('typeRate', {
                grid: Global._defaultAxis.grid,
                label: function label(text, index, total) {
                    var textCfg = {};
                    if (index === 0) {
                    textCfg.textAlign = 'left';
                    } else if (index === total - 1) {
                    textCfg.textAlign = 'right';
                    }
                    return textCfg;
                }
            });
            this.brandChart.tooltip({
                onShow: function onShow(ev) {
                    var items = ev.items;
                    items[0].name = null;
                    items[0].name = items[0].title;
                    items[0].value = items[0].value+'%';
                },
            });
            this.brandChart.interval().position('dataGroupName*typeRate').size('typeRate', z => {
                return 20;
            });
            // 绘制文本
            data.map(function(obj) {
                that.brandChart.guide().text({
                    position: [obj.dataGroupName, obj.typeRate],
                    content: obj.typeRate+'%',
                    style: {
                        textAlign: 'start',
                        // stroke: '#999',
                    },
                    offsetX: 0
                });
            });
            this.brandChart.render();
      },
      //省份城市
        getRegionChart(){
            let that = this;
            var Global = F2.Global;
            if(this.regionChart){
                this.regionChart.clear();
            }
            this.regionChart = new F2.Chart({
                id: 'regionCavas',
                pixelRatio: window.devicePixelRatio,
                padding:['auto' ,40, 'auto', 'auto']
            });
            var data = [];
            data = this.regionData;
            this.regionChart.source(data,{
                xField: {
                    type: 'timeCat', // 声明该数据的类型
                    tickCount: 9
                }
            });
            this.regionChart.coord({
                transposed: true
            });
            this.regionChart.axis('dataGroupName', {
                line: Global._defaultAxis.line,
                grid: null
            });
            this.regionChart.axis('typeRate', {
                line: Global._defaultAxis.line,
                grid: Global._defaultAxis.grid,
                label: function label(text, index, total) {
                    var textCfg = {};
                    if (index === 0) {
                    textCfg.textAlign = 'left';
                    } else if (index === total - 1) {
                    textCfg.textAlign = 'right';
                    }
                    return textCfg;
                }
            });
            this.regionChart.tooltip({
                // showItemMarker: false,
                onShow: function onShow(ev) {
                    var items = ev.items;
                    items[0].name = null;
                    items[0].name = items[0].title;
                    items[0].value = items[0].value+'%';
                },
            });
            data.map(function(obj) {
                that.regionChart.guide().text({
                    position: [obj.dataGroupName, obj.typeRate],
                    content: obj.typeRate+'%',
                    style: {
                        textAlign: 'start',
                        // stroke:'#fff'
                    },
                    offsetX: 0
                });
            });
            this.regionChart.interval().position('dataGroupName*typeRate').size('typeRate', z => {
                return 20;
            });
            this.regionChart.render();
      },
      getageCavas(){
            var Global = F2.Global;
            var data = [];
            if(this.ageChart){
              this.ageChart.clear()
            }
            this.ageChart = new F2.Chart({
                id: 'ageCavas',
                pixelRatio: window.devicePixelRatio
            });
            data = this.ageData;
            this.ageChart.source(data);
            this.ageChart.axis('typeRate', {
                line: Global._defaultAxis.line,
                grid: Global._defaultAxis.grid
            });
            this.ageChart.tooltip({
                onShow: function onShow(ev) {
                    var items = ev.items;
                    items[0].name = null;
                    items[0].name = items[0].title;
                    items[0].value = items[0].value+'%';
                },
                inPlot: true, // 将 tooltip 展示在指定区域内
                follow: true, // tooltip 是否跟随鼠标移动
                shared: true || false, // 默认为 true, false 表示只展示单条 tooltip
                position: 'left' // 固定位置展示 tooltip
            });
            this.ageChart.interval().position('dataGroupName*typeRate');
            this.ageChart.render();
            // 绘制柱状图文本
            var offset = -5;
            var canvas = this.ageChart.get('canvas');
            var group = canvas.addGroup();
            var shapes = {};
            let that = this;
            data.map(function(obj) {
                var point = that.ageChart.getPosition(obj);
                var text = group.addShape('text', {
                    attrs: {
                    x: point.x,
                    y: point.y + offset,
                    text: obj.typeRate+'%',
                    textAlign: 'center',
                    textBaseline: 'bottom',
                    fill: '#808080'
                    }
                });
                shapes[obj.dataGroupName] = text; // 缓存该 shape, 便于后续查找
            });
      },
      getBorrowCavas(){
          var Global = F2.Global;
          var data = [];
          data = this.borrowData;
          if(this.borrowChart){
              this.borrowChart.clear()
          }
          this.borrowChart = new F2.Chart({
            id: 'borrowCavas',
            pixelRatio: window.devicePixelRatio
        });
            this.borrowChart.source(data);
            this.borrowChart.axis('typeRate', {
                line: Global._defaultAxis.line,
                grid: Global._defaultAxis.grid
            });
            this.borrowChart.tooltip({
                onShow: function onShow(ev) {
                    var items = ev.items;
                    items[0].name = null;
                    items[0].name = items[0].title;
                    items[0].value = items[0].value+'%';
                },
                inPlot: true, // 将 tooltip 展示在指定区域内
                follow: true, // tooltip 是否跟随鼠标移动
                shared: true , // 默认为 true, false 表示只展示单条 tooltip
                position: 'left' // 固定位置展示 tooltip
            });
            this.borrowChart.interval().position('dataGroupName*typeRate');
            this.borrowChart.render();
            // 绘制柱状图文本
            var offset = -5;
            var canvas = this.borrowChart.get('canvas');
            var group = canvas.addGroup();
            var shapes = {};
            let that = this;
            data.map(function(obj) {
                var point = that.borrowChart.getPosition(obj);
                var text = group.addShape('text', {
                    attrs: {
                    x: point.x,
                    y: point.y + offset,
                    text: obj.typeRate+'%',
                    textAlign: 'center',
                    textBaseline: 'bottom',
                    fill: '#808080'
                    }
                });
                shapes[obj.dataGroupName] = text; // 缓存该 shape, 便于后续查找
            });
      },
      //处理百分比数据
      dealPercent(data,val){
          var map = {};
            data.map(function(obj) {
            map[obj.memo] = (obj.ratio*100).toFixed(2) + '%';
        });
        return map
      },
    }
}
</script>
<style lang="less" scoped>
    @import '../../assets/css/userData.less';
</style>


