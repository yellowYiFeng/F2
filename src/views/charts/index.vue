<template>
    <div>
        <tab :line-width=1 active-color='#4e8dee' v-model="index">
            <tab-item class="vux-center" :selected="selected === index" v-for="(item, index) in list" @click="selected = index" :key="index">{{item}}</tab-item>
        </tab>
        <div v-model="index" :show-dots="false" >
            <!-- 昨日概况 -->
            <div class="tab-content" v-show="index == 0"><yesterday-survey></yesterday-survey></div>
            <!-- 详细数据 -->
            <div class="tab-content" v-show="index == 1"><detail-data></detail-data></div>
            <!-- 用户画像 -->
            <div class="tab-content" v-show="index == 2"><user-data></user-data></div>
            <!-- 业绩TOP -->
            <div class="tab-content" v-show="index == 3"><achievement-top></achievement-top></div>
        </div>
    </div>
</template>


<style lang="less">
@import '../../assets/css/charts.less';
</style>
<script>
import {getRoleLevel} from '../../service/getData.js'
import {Tab , TabItem , Swiper, SwiperItem} from 'vux'
import YesterdaySurvey from './yesterdaySurvey.vue'
import DetailData from './detailData.vue'
import UserData from './userData.vue'
import AchievementTop from './achievementTop.vue'

export default{
    components: {
        Tab,
        TabItem,
        Swiper,
        SwiperItem,
        YesterdaySurvey,
        DetailData,
        UserData,
        AchievementTop
    },

    data(){
        return {
            index: 1,
            selected: 0,
            list: ['昨日概况','详细数据','用户画像','业绩TOP'],
        }
    },
    created(){
        
        let width = document.body.clientWidth - 20 + "px";
        this.$store.dispatch("setWidth",width);
    },
    mounted(){
    },
     methods:{
    },
}
</script>
