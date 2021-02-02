import router from './router'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

import store from '@/store'
import * as util from '@/utils'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  setRouterHistory_(to)
  next()
  NProgress.done()

  // 限制路由跳转 -----
  // determine whether the user has logged in
  // const hasToken = getToken()
  
  // if (hasToken) {
  //   if (to.path === '/login') {
  //     // if is logged in, redirect to the home page
  //     next({ path: '/' })
  //     NProgress.done()
  //   } else {
  //     const hasGetUserInfo = store.getters.name
  //     if (hasGetUserInfo) {
  //       next()
  //     } else {
  //       try {
  //         // get user info
  //         // await store.dispatch('user/getInfo')

  //         next()
  //       } catch (error) {
  //         // remove token and go to login page to re-login
  //         await store.dispatch('user/resetToken')
  //         Message.error(error || 'Has Error')
  //         next(`/login?redirect=${to.path}`)
  //         NProgress.done()
  //       }
  //     }
  //   }
  // } else {
  //   /* has no token*/

  //   if (whiteList.indexOf(to.path) !== -1) {
  //     // in the free login whitelist, go directly
  //     next()
  //   } else {
  //     // other pages that do not have permission to access are redirected to the login page.
  //     next(`/login?redirect=${to.path}`)
  //     NProgress.done()
  //   }
  // }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

function setRouterHistory_(to_){
  var to = {...to_}
  var routerHistory = store.state.app.routerHistory;
  var new_path = to.path.split("/").slice(0,3).join("/");
  var title = to.meta && to.meta.title ? to.meta.title:""
  var showBreadcrumb = util.isEmpty(to.meta.breadcrumb)? true: to.meta.breadcrumb;
  if(routerHistory.length > 0 && title != "" && showBreadcrumb){
      var old_path = routerHistory[routerHistory.length -1].router.split("/").slice(0,3).join("/");
      if(old_path != new_path){ //不同模块菜单- 清空路由(面包屑数据)历史
          store.commit("app/clearRouterHistory")
          store.commit("app/setRouterHistory", [{router: to.path, title: title}])
      }else{
          var routerIndex = -1;
          routerHistory.some((item,index)=>{
              if(title == item.title){
                  routerIndex = index
                  return;
              }
          })
          // 1、历史记录无此路由，则push一条(最多6条)；2、有则历史回到当前路由位置
          if(routerIndex == -1){
              if(routerHistory.length == 6){
                  routerHistory[5] = {router: to.path, title: title}
              }else{
                  routerHistory.push({router: to.path, title: title})
              }
              store.commit("app/setRouterHistory", routerHistory)
          }else{
              store.commit("app/setRouterHistory", routerHistory.splice(0,routerIndex+1))
          }
      }
  }else if(routerHistory.length == 0 && title != "" && showBreadcrumb){//初始时，直接push一条历史
      routerHistory.push({router: to.path, title: title})
      store.commit("app/setRouterHistory", routerHistory)
  }
  
}
