import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
	title: 'title'               the name show in sidebar and breadcrumb (recommend set)
	breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
	activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set

	// 未完善
	roles: ['admin','editor']    control the page roles (you can set multiple roles)
	icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [

	{
		path: '/404',
		component: () => import('@/views/404'),
		hidden: true
	},
	{
		path: '/',
		component: Layout,
		redirect: "/aPage",
		children: [{
			path: 'aPage',
			name: 'aPage',
			component: () => import('@/views/a/aPage'),
			meta: { title: 'a页面', icon: 'el-icon-tickets' }
		}]
	},
	{
		path: '/bPage',
		component: Layout,
		redirect: "/bPage/index",
		meta: { title: 'b页面管理', icon: 'el-icon-tickets', activeMenu: "/bPage" },
		children: [{
			path: 'b',
			component: () => import('@/views/b/bPage'),
			meta: { title: 'b页面',activeMenu: "/bPage" }
		},{
			path: 'b/list/:id',
			name: 'bPageList',
			component: () => import('@/views/b/bPageList'),
			meta: {  title: 'b页面-list',activeMenu: "/bPage" },
			hidden: true,
		},{
			path: 'b/list/info/:id',
			name: 'bPageListInfo',
			component: () => import('@/views/b/bPageListInfo'),
			meta: {  title: 'b页面-list-info',activeMenu: "/bPage" },
			hidden: true,
		},{
			path: 'b/list/info/detail/:id',
			name: 'bPageListInfoDetail',
			component: () => import('@/views/b/bPageListInfoDetail'),
			meta: {  title: 'b页面-list-info-detail',activeMenu: "/bPage" },
			hidden: true,
		},{
			path: 'order',
			name: 'bPageOrder',
			component: () => import('@/views/b/bPageOrder'),
			meta: { title: 'b页面order', activeMenu: "/bPage" },
		}]
	},

	// 404 page must be placed at the end !!!
	{ path: '*', redirect: '/404', hidden: true }
]

export const asyncRoutes = [
	{
		path: '/roles',
		component: Layout,
		redirect: "/roles/index",
		children: [{
			path: 'index',
			name: 'rolesIndex',
			component: () => import('@/views/roles/index'),
			meta: { title: 'roles', icon: 'el-icon-tickets' }
		}]
	},
]

const createRouter = () => new Router({
	// mode: 'history', // require service support
	scrollBehavior: () => ({ y: 0 }),
	routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
	const newRouter = createRouter()
	router.matcher = newRouter.matcher // reset router
}

export default router
