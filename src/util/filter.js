//返回绝对值
function absValue(value){
    return Number(value) ? Math.abs(value) : 0;
}
function fixed(value){
    return Number(value) ? value.toFixed(2) : 0;
}
//判断上升还是下降
function checkUpDown(data){
    let icon = '';
    if(data > 0){
        icon = 'up'
      }else if(data < 0){
        icon = 'down'
      }else{
        icon = ''
      }
    return icon;
}


export {
    absValue,
    checkUpDown,
    fixed
}