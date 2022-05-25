import axios from 'axios';
import { compareObject } from './utils';

/**
 * 需要用户提供一个axios实例
 * @param {*} axiosInstance 
 * @returns 
 */
function axiosCache(axiosInstance, options = {}) {
    const _CACHE_MAX = options.max || 10;
    // 缓存列表
    var _cache_map_ = new Map();

    function siteCache(path, response, option) {
        let temp = {
            path: '/',
            _weight_: 1
        };
        if (_cache_map_.size >= _CACHE_MAX) {
            _cache_map_.forEach((item, key) => {
                if (item._weight_ >= temp._weight_) {
                    temp = {
                        path: key,
                        _weight_: item._weight_
                    };
                }
            });
            // 去除掉权重最低的缓存
            _cache_map_.delete(temp.path);
        }
        _cache_map_.set(path, {
            // 该条路径的权重(后续当达到最大缓存时根据权重舍弃掉某条权重最小的路径缓存信息)
            _weight_: option['weight'] || 1,
            _response_: response,
            _key_: option['key'] || {},
        })
    }

    function getCache(path) {
        return _cache_map_.get(path);
    }

    function clearCache() {
        _cache_map_.clear();
    }

    async function updateCache(path) {
        return await cacheAxiosInstance(path);
    }

    function pathHasCache(path) {
        return _cache_map_.has(path);
    }

    async function cacheAxiosInstance({ cacheOptions, ...rest }) {
        // 暂存一下用户额外信息
        let tempCache = cacheOptions || {};
        // 如果该路径已经被缓存，则直接返回缓存的数据
        let cacheLock = false;
        _cache_map_.forEach((value, key) => {
            if (!cacheLock) cacheLock = compareObject(value._key_, rest);
        })
        if (cacheLock && !tempCache.notCache) {
            return getCache(rest.url)._response_;
        }
        // 如果该路径未被缓存，则进行网络请求
        const tempResponse = await axiosInstance(rest);
        tempCache['key'] = rest;
        !tempCache.notCache && siteCache(rest.url, tempResponse, tempCache);
        return tempResponse;
    }
    cacheAxiosInstance.Cache = {
        // 清空缓存
        clearCache,
        // 更新某条路径的缓存
        updateCache,
        // 判断某条路径是否被缓存
        pathHasCache,
    };
    return cacheAxiosInstance;
}

/**
 * 生成一个Axios实例, 注意该实例为Axios原生的, 并未进行内部缓存操作, 如有需要缓存请自定调用axiosCache方法
 * @param {*} options 
 * @returns 
 */
export function axiosCacheFactory(options = {}) {
    return axios.create(options);
}

const instance = axiosCacheFactory({
    baseURL: 'https://netease-cloud-music-api-opal-eight.vercel.app/'
});

// 这是一个包装有缓存功能的实例
const cacheInstance = axiosCache(instance);

cacheInstance({
    method: 'get',
    url: '/mv/all',
}).then(response => {
    console.log('response', response);
    cacheInstance({
        method: 'get',
        url: '/homepage/dragon/ball',
    }).then(response => {
        console.log('response', response);
        cacheInstance({
            method: 'get',
            url: '/mv/all',
        }).then(response => {
            console.log('response', response);
        })
    })
})

console.log(cacheInstance.Cache.pathHasCache({
    method: 'get',
    url: '/mv/all',
})); // false
cacheInstance.Cache.updateCache({
    method: 'get',
    url: '/mv/all',
}).then(response => {
    console.log(response);
})
cacheInstance.Cache.clearCache();