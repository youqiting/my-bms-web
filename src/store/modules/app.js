import Cookies from 'js-cookie'
// import { queryAppInfos } from '@/http/api/appApi'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
    withoutAnimation: false
  },
  device: 'desktop',
  isLoading: false,
  applyApp:[],
}

const mutations = {
  TOGGLE_SIDEBAR: state => {
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
  },
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  },
  TOGGLE_LOADING: (state, val) => {
    state.isLoading = val
  },
  UPDATE_APP: (state, val) => {
    state.applyApp = [...val]
  },
}

const actions = {
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  },
  UPDATE_APP({ commit }) {
    return new Promise((resolve, reject) => {
      // queryAppInfos().then((res) => {
      //   let appTypeList = [
      //     {name: "h5", key: 1},
      //     {name: "app", key: 2},
      //     {name: "小程序", key: 3},
      //   ]
      //   let appList = []
      //   res.resultData.forEach(item=>{
      //     appList.push({
      //       appTypeName: appTypeList[item.appType -1].name,
      //       appType: item.appType,
      //       appId: item.appId,
      //       name: item.name,
      //     })
      //   })
      //   commit('UPDATE_APP', appList)
      //   resolve()
      // }).catch((err) => {
      //   resolve()
      // });
    })
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
