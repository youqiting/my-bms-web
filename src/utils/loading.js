import { Loading } from 'element-ui';
import store from '@/store'

var loading;
var loadingCount = 0; //loading发起时加的计数锁
var numberCount = 0; //定时器增加的数值
var timer = null; //定时器
const loadingTime = 15; //超时时间值

const defaultState = {
    text: "加载中",
    time: ""
}
const startLoading = (state) => {
    // loading = Loading.service({ // 全屏loading
    //     fullscreen:true,
    //     text:state.text,
    //     background:'rgba(0,0,0,0.6)'
    // })
    store.commit("app/TOGGLE_LOADING",true)

    if (state.time) {
        setTimeout(() => {
            endLoading();
            loadingCount = 0
        }, state.time)
    }

    // 超时关闭loading
    timer = setInterval(() => {
        numberCount++;
        if (numberCount > loadingTime) {
            endLoading();
            loadingCount = 0
        }
    }, 1000)
};

const endLoading = () => {
    store.commit("app/TOGGLE_LOADING",false) // loading.close();
    // 接除timer
    clearInterval(timer)
    numberCount = 0
};

export const showLoading = (state = defaultState) => {
    if (loadingCount === 0) {
        startLoading(state);
    }
    loadingCount += 1;
};

export const hideLoading = () => {
    if (loadingCount <= 0) {
        return;
    }
    loadingCount -= 1;
    if (loadingCount === 0) {
        endLoading();
    }
};