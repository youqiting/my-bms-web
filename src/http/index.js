/* 
    自动引入api目录下所有接口文件
*/

let API = {}
const apiModule = require.context('./',true,/^\.\/api\/.*\.js$/)
apiModule.keys().forEach(filename => {
    const componentConfig = apiModule(filename)
    let componentName = filename.replace(/^\.\//, '').replace(/\.\w+$/, '')
    let index = componentName.indexOf('/')
    if (index !== -1) componentName = componentName.substr(index + 1)
    API[componentName] = componentConfig
});

export default {
    install(Vue){
        // 将所有接口挂到原型对象里面
        Vue.prototype.$api = API;
    }
}