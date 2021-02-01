import Request from '@/http/request';
var http = new Request()

const service = "/schema"  //schemaApi

function getService(api) {
    return service + api
}


export function queryTableSchemas(params) {
    return http.post(getService('/queryTableSchemas'), params)
}

export function queryColumnsSchemas(params) {
    return http.post(getService('/queryColumnsSchemas'), params)
}

// 查询外部表信息
export function queryExternalTable(params) {
    return http.get(getService('/queryExternalTable'), params)
}

export function createExternalTable(params) {
    return http.post(getService('/createExternalTable'), params)
}

export function deleteExternalTable(params) {
    return http.get(getService('/deleteExternalTable'), params)
}

// doris数据库
export function queryDorisDb(params) {
    return http.get(getService('/queryDorisDb'), params)
}
export function createDorisDb(params) {
    return http.get(getService('/createDorisDb'), params)
}


// 外部资源
export function queryResources(params) {
    return http.get(getService('/queryResources'), params)
}

export function createResource(params) {
    return http.get(getService('/createResource'), params)
}

export function deleteResource(params) {
    return http.get(getService('/deleteResource'), params)
}