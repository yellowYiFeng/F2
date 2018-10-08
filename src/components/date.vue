<template>
    <div>
        <div class="tl">
            <x-button mini v-for="(item,index) in dayList" :class="dayIndex === index ? 'activityBtn' :''" @click.native="changeTimeFilter(index,item.value)">{{item.name}}</x-button>
        </div>
        <div class="inline-picker">
        <flexbox>
            <flexbox-item>
                <group>
                    <datetime v-model="dateFromBind" @on-change="changeDateFrom" @on-confirm="clearBtn"></datetime>
                </group>
            </flexbox-item>
            <flexbox-item>
                <group>
                    <datetime v-model="dateToBind" @on-change="changeDateTo" @on-confirm="clearBtn"></datetime>
                </group>
            </flexbox-item>
        </flexbox>
    </div>
    
    </div>
</template>
<style lang="less" >
    @import '../assets/css/userData.less';
</style>
<script>
import { AlertModule } from 'vux'
export default {
  data() {
    return {
      dayList:[{name:'昨天',value:'1'},{name:'最近七天',value:'7'},{name:'最近三十天',value:'30'}],
    };
  },
  computed: {
    dateFromBind: {
      get: function() {
        return this.$store.state.datePick.dateFrom;
      },
      set: function(newValue) {
        this.$store.dispatch("setDateFrom", newValue);
      }
    },
    dateToBind: {
      get: function() {
        return this.$store.state.datePick.dateTo;
      },
      set: function(newValue) {
        this.$store.dispatch("setDateTo", newValue);
      }
    },
    dayIndex:{
        get:function(){
            return this.$store.state.datePick.btnIndex;
        },
        set:function(newValue){
            this.$store.dispatch('setBtnIndex',newValue);
        },
    }
  },
  methods: {
    changeDateFrom(val) {
        if(this.$utils.compareDate(this.$store.state.datePick.dateFrom,this.$store.state.datePick.dateTo) == -1){
            AlertModule.show({
                title: '提示',
                content: '结束时间不得大于起始时间',
            });
        }else{
            this.$store.dispatch("setDateFrom",val);
            this.$emit('ee');
        }
        
    },
    changeDateTo(val) {
        if(this.$utils.compareDate(this.$store.state.datePick.dateFrom,this.$store.state.datePick.dateTo) == -1){
            AlertModule.show({
                title: '提示',
                content: '结束时间不得大于起始时间',
            });
        }else{
            this.$store.dispatch("setDateTo",val);
            this.$emit('ee');
        }
        
    },
    changeTimeFilter(index,value){
        let dateFrom = this.moment().subtract(value,'days').format('YYYY-MM-DD') ;//往前推的时间
        let dateTo = this.moment().subtract(1,'days').format('YYYY-MM-DD');
        this.$store.dispatch("setDateFrom",dateFrom);
        this.$store.dispatch("setDateTo", dateTo);
        this.$store.dispatch('setBtnIndex',index);
        this.$emit('ee');
    },
    clearBtn(){
        this.$store.dispatch('setBtnIndex','');//清空btn选中
    },
  }
};
</script>
