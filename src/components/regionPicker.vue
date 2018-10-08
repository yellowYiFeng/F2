<template>
  <div class="inline-picker hide-pick-value">
      <ul class="pick-list height-fixed-pick">
          <li v-show="isShow.region">
                <group>
                    <popup-picker class="height-fixed-cell" :data="regionList" :title="title.region" v-model="region" :columns="regionList.length" :show-name="true" value-text-align="left"></popup-picker>
                </group>
          </li>
          <li v-show="isShow.shop">
                <group>
                    <popup-picker class="height-fixed-cell" :data="shopList" :title="title.shop" v-model="shop"  :columns="shopList.length" :show-name="true" value-text-align="left"></popup-picker>
                </group>
          </li>
          <li v-show="isShow.group">
                <group>
                    <popup-picker class="height-fixed-cell" :data="groupList" :title="title.group" v-model="group"  :columns="groupList.length" :show-name="true" value-text-align="left"></popup-picker>
                </group>
          </li>
          <li v-show="isShow.sales">
                <group>
                    <popup-picker class="height-fixed-cell" :data="salesList" :title="title.sales" v-model="sales"  :columns="salesList.length" :show-name="true" value-text-align="left"></popup-picker>
                </group>
          </li>
      </ul>
  </div>
</template>

<style lang="less">
@import '../assets/css/regionPicker';
</style>

<script>
import { mapState } from 'vuex'
import { PopupPicker } from 'vux'
import {getRegionApi,getSubRegionApi} from '../service/getData'
export default{
	components: {
		PopupPicker
	},
	data(){
		return {
            regionList: [{name: "全部",value:""}],
            shopList:   [{name: "全部",value:""}],
            groupList:  [{name: "全部",value:""}],
            salesList:  [{name: "全部",value:""},{name: "1",value:"1"}],
            pageType:   "",
            title:{
                region: "全部",
                shop: "全部",
                group: "全部",
                sales: "全部"
            },
            isShow: {
                region: false,
                shop: false,
                group: false,
                sales: false
            }

		}
    },
    computed: {
        region: {
            get: function () {
                return this.$store.getters.region;
            },
            set: function (newValue) {
                this.$store.dispatch('setRegion',newValue);
                this.$store.dispatch("setPageType",'region');
                //如果不是全部就获取下级列表 否则隐藏下级
                if(newValue[0] != ''){
                    this.getSubRegionList({"PageType": "region","ObjectId": newValue[0]})
                    this.toggleNextList(["group","sales"],["shop"]);
                }else{
                    this.toggleNextList(["shop","group","sales"]);
                }
                this.title.region = this.getName(this.regionList,newValue);
                this.title.shop = "全部";
                //向父组件传递区域修改信息
                this.$emit('changeRegion');
                
            }
        },
        shop: {
            get: function () {
                return this.$store.getters.shop;
            },
            set: function (newValue) {
                this.$store.dispatch('setShop',newValue);
                //如果不是全部就获取下级列表 否则隐藏下级
                if(newValue[0] != ''){
                    this.getSubRegionList({"PageType": "shop","ObjectId": newValue[0]})
                    this.toggleNextList(["sales"],["group"]);
                    this.$store.dispatch('setPageType',"shop");
                }else{
                    this.toggleNextList(["group","sales"]);
                    //如果选的是全部 pageType 应该为上一级
                    this.$store.dispatch('setPageType',"region");
                }
                this.title.shop = this.getName(this.shopList,newValue);
                this.title.group = "全部";
                //向父组件传递区域修改信息
                this.$emit('changeRegion');
            }
        },
        group: {
            get: function () {
                return this.$store.getters.group;
            },
            set: function (newValue) {
                this.$store.dispatch('setGroup',newValue);
                //如果不是全部就获取下级列表 否则隐藏下级
                if(newValue[0] != ''){
                    this.getSubRegionList({"PageType": "group","ObjectId": newValue[0]})
                    this.toggleNextList([],["sales"]);
                    this.$store.dispatch('setPageType',"group");
                }else{
                    this.toggleNextList(["sales"],[]);
                    //如果选的是全部 pageType 应该为上一级
                    this.$store.dispatch('setPageType',"shop");
                }
                this.title.group = this.getName(this.groupList,newValue);
                this.title.sales = "全部";
                //向父组件传递区域修改信息
                this.$emit('changeRegion');
                
            }
        },
        sales: {
            get: function () {
                return this.$store.getters.sales;
            },
            set: function (newValue) {
                this.$store.dispatch('setSales',newValue);
                if(newValue[0] != ''){
                    this.$store.dispatch('setPageType',"sales");
                }else{
                    //如果选的是全部 pageType 应该为上一级
                    this.$store.dispatch('setPageType',"group");
                }
                this.title.sales = this.getName(this.salesList,newValue);;
                //向父组件传递区域修改信息
                this.$emit('changeRegion');
            }
        }
    },
    mounted() {
        this.getRegionList();
    },
    methods: {
        //获取区域列表
        getRegionList(){
            getRegionApi().then(res => {
                res = res.result;
                this.regionList = this.$utils.dealRegionObj(res.dataList);
                this.pageType = res.pageType;
                //修改vuex中pageType中的值
                this.isShow[res.pageType] = true;
            }).catch()
        },
        //获取下级区域列表
        getSubRegionList(data){
            getSubRegionApi(data).then(res => {
                res = res.result;
                let list = this.$utils.dealRegionObj(res);
                switch(data.PageType){
                    case "region": this.shopList = list;break;
                    case "shop": this.groupList = list;break;
                    case "group": this.salesList = list;break;
                }
            }).catch()
        },
        toggleNextList(hideList,showList){
            if(hideList){
                hideList.forEach(item => {
                    this.isShow[item] = false;
                });
            }
            if(showList){
                showList.forEach(item => {
                    this.isShow[item] = true;
                });
            }
        },
        getName(array,value){
            let name = '';
            for(let i = 0;i<array.length;i++){
                if(array[i].value == value[0]){
                    name = array[i].name;
                    break;
                }
            }
            return name;
        }
    }
  }
</script>
