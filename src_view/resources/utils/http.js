

import axios from 'axios';


function getMethod(endpoint, params = {}, isRestricted = false) {

    // TODO host 에 맞춰서 full url build
    // const url = buildFullUrl(endpoint);
    const url = endpoint;

    if (isRestricted) {
        return new Promise(function GETPromise(resolve, reject) {
            axios.get(url, params, {
                headers: {
                    'Authorization': 'Bearer ' + getJWTToken()
                }
            })
                .then((resp) => resolve({
                    code: resp.data.code,
                    data: resp.data.data,
                    headers: resp.headers
                }))
                .catch((errResp) => reject(errResp));
        });
    }

    return new Promise(function GETPromise(resolve, reject) {
        axios.get(url, params)
            .then((resp) => {
                resolve({
                    code: resp.data.code,
                    data: resp.data.data,
                    headers: resp.headers
                })
            })
            .catch((errResp) => reject(errResp));
    });
}

function postMethod(endpoint, body = {}, isRestricted = false) {

    const url = endpoint;

    if (isRestricted) {
        return new Promise(function POSTPromise(resolve, reject) {
            axios.post(url, body, {
                headers: {
                    'Authorization': 'Bearer ' + getJWTToken()
                }
            })
                .then((resp) => resolve({
                    code: resp.data.code,
                    data: resp.data.data,
                    headers: resp.headers
                }))
                .catch((errResp) => reject(errResp));
        });
    }

    return new Promise(function POSTPromise(resolve, reject) {
        axios.post(url, body)
            .then((resp) => {
                resolve({
                    code: resp.data.code,
                    data: resp.data.data,
                    headers: resp.headers
                })
            })
            .catch((errResp) => reject(errResp));
    });
}


module.exports = {
    getMethod,
    postMethod
}
