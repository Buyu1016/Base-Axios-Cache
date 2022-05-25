// 递归比较obj1是否等于obj2
export function compareObject(obj1, obj2) {
    const obj1Type = Object.prototype.toString.call(obj1);
    const obj2Type = Object.prototype.toString.call(obj2);
    if (obj1Type !== obj2Type) {
        return false;
    }
    if (['[object String]', '[object Number]', '[object Boolean]'].includes(obj1Type)) {
        return obj1 === obj2;
    } else if (obj1Type === '[object Function]') {
        // 判断两个函数是否相等可能比较难处理，暂不处理
        return true;
    } else if (obj1Type === '[object Array]') {
        for (let i = 0; i < obj1Type.length; i++) {
            const temp = compareObject(obj1[i], obj2[i]);
            if (!temp) return temp;
        }
        return true;
    } else if (obj1Type === '[object Object]') {
        const tempKey1 = Object.keys(obj1);
        const tempValues1 = Object.values(obj1);
        const tempKey2 = Object.keys(obj2);
        const tempValues2 = Object.values(obj2);
        if (tempKey1.length !== tempKey2.length || tempValues1.length !== tempValues2.length) return false;
        for (const key in obj1) {
            if (obj2.hasOwnProperty(key)) {
                const temp = compareObject(obj1[key], obj2[key]);
                if (!temp) return temp;
            } else {
                return false;
            }
        }
        return true;
    }
}