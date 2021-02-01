/* 自定义组件全局注册 */

// import {showLoading,hideLoading} from '@/util/loading'

const Components = {
    install(Vue){
        const requireComponent = require.context('./base',true,/\.vue$/)
        requireComponent.keys().forEach(filename => {
            const componentConfig = requireComponent(filename)
            //获取组件配置
            let componentName = filename.replace(/^\.\//, '').replace(/\.\w+$/, '')
            let index = componentName.indexOf('/')
            if (index !== -1) componentName = componentName.substr(index + 1)
            Vue.component(componentName, componentConfig.default || componentConfig)
        });

        // 将组建挂载到Vue实例的原型对下
        // Vue.prototype.$Loading = {
        //     showLoading,hideLoading
        // };
    }
}
export default Components