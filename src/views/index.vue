<template>
    <div></div>
</template>

<script>
import Cookies from 'js-cookie'
import {getRoleLevel} from '../service/getData.js'
import { AlertModule } from 'vux'
export default{
    created(){
        Cookies.set('userId',this.$utils.getQueryStringValue('userId'));
        Cookies.set('token',this.$utils.getQueryStringValue('token'));
        Cookies.set('platform',this.$utils.getQueryStringValue('platform'));
        this.getRole();
    },
     methods:{
        getRole(){
            getRoleLevel().then(res=>{
                Cookies.set('level',res.result.roleLevel);
                this.$router.push({
                    name: 'Charts',
                });
            }).catch(res => {
            })
        },
    },
}
</script>