import Request from '@/http/request';
var http = new Request()

const service = "/db"  //dbApi

function getService(api) {
    return service + api
}

export function queryDb() {
    return http.get(getService('/queryDb'), {})
}

export function createDb(params) {
    return http.post(getService('/createDb'), params)
}
export function updateDb(params) {
    return http.post(getService('/updateDb'), params)
}

export function deleteDb(params) {
    return http.get(getService('/deleteDb'), params)
}

