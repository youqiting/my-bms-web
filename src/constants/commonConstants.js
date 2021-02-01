import SystemConst from "./systemConstants"

import { Message } from 'element-ui';

function showMessage(res, type){
    Message({
        message: typeof res.resultData == 'string'? res.resultData : 'Error' + res.status,
        type: type || 'error',
        duration: 5 * 1000
    })
}

export function showError(res){
    if (typeof res.resultData == 'string' && res.resultData.indexOf("查询无数据") > -1) {
        // showMessage(res,'warning')
        return true
    }else if (res.status != SystemConst.status.success) {
        showMessage(res)
        return true
    }else{
        return false
    }
}

export function getRuleTypeList(){
    return ["clck","page","cstm","chng"]
}