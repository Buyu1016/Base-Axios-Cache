# Base-Axios-Cache

**Example**

```js
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
```

🚀 We can find that only two requests occur in this code, which is an obvious efficiency improvement in the actual user experience of the page, eliminating some of the Response content that is repeated for the acquired content, and reducing the number of requests initiated by the web page. . Of course, there is a Cache object on the wrapped instance, which has methods for updating the cache, clearing the cache, and judging the cache, so that you can have a better user experience.

💣 Please note that the parameters filled in for updating the cache and judging the cache mentioned above are the parameters you pass when calling the wrapped instance method.

🚪 future improvements:
    1. Add more instance call methods.
    2. Make the cache have the ability to update regularly.
    3. Better user experience.

🌈 Thank you for your use!