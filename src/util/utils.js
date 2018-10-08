import { dateFormat } from 'vux'
//获取地址栏参数
var getQueryStringValue = (name)=>{
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
    var r = window.location.href.substr(window.location.href.indexOf("?")+1).match(reg); 
    if (r != null) return unescape(r[2]); return null; 
}
//处理性别数据
var dealSexData = (arr) => {
    var temp = []
    if(arr != ''){
        for(var j=0;j<arr.length;j++){
            let sex = ''
            if(arr[j].dataGroupName == '0'){
                sex = '男'
            }else{
                sex = '女'
            }
            let obj = 
            {
                memo:sex,
                amount:arr[j].typeCount,
                ratio:(arr[j].typeRate)/100
            };
            temp.push(obj);
        }
    }else{
        temp = [{memo:'男',amount:0,ratio:0.5},{memo:'女',amount:0,ratio:0.5}]
    }
    return temp;
}
//处理业绩top数据
var getTopCavasData = (arr,type) => {
    var temp = [];
    if(type == 'shop'){
        for(var i=0;i<arr.length;i++){
            var obj = {
                name:arr[i].shopName,
                doneCount:arr[i].doneCount,
                type: i + ''
            };
            temp.push(obj);
        }
    }else if(type == 'group'){
        for(var i=0;i<arr.length;i++){
            var obj = {
                name: arr[i].groupName,
                doneCount: arr[i].doneCount,
                type: i + ''
            };
            temp.push(obj);
        }
    }else if(type == 'sales'){
        for(var i=0;i<arr.length;i++){
            var obj = {
                name : arr[i].salesManName,
                doneCount : arr[i].doneCount,
                type: i + ''
            };
            temp.push(obj);
        }
    }
    return temp;
}

//处理区域返回数据
var dealRegionObj = (array) => {
    let list = [{name: "全部",value:""}];
    for(var item in array){
        if(array[item].objectId && array[item].objectName){
            list.push({
                name: array[item].objectName,
                value: array[item].objectId
            });
        }
        
    }
    return list;
}
//获取指定天数之前的日期
var getAgoDate = (num) => {
    let date = (new Date()).getTime() - num * 24 * 60 * 60 * 1000;
    return  dateFormat(new Date(date), 'YYYY-MM-DD');
}

//数组排序
var sortArray = (arr, type) => {
    if(arr != '' ){
        arr.sort(function (a, b) {
            if (a[type] > b[type]) {
              return 1;
            } else if (a[type] < b[type]) {
              return -1
            } else {
              return 0;
            }
          });
    }else{
        arr = [{dataGroupName:'0',typeRate:0}]
    }
    
    return arr
}
//比较两个日期大小
var compareDate = (dateStart,dateEnd) => {
    let startTime = new Date(dateStart);
    let endTime = new Date(dateEnd);
    let result = 0;
    if((endTime - startTime) > 0){
        result = 1;
    }else if((endTime - startTime) < 0){
        result = -1;
    }
    return result;
}
export default{
    getQueryStringValue,
    getTopCavasData,
    dealRegionObj,
    getAgoDate,
    sortArray,
    dealSexData,
    compareDate,
}