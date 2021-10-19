import Dep from './Dep.js';


// 监听器
class Observer {
    constructor(data) {
        this.data = data;
        this.walk(data);
    }
    // 循环添加拦截器
    walk(data) {
        // data为空则停止
        if (!data || typeof data !== "object") {
            return;
        }
        // 不为空则添加监视器
        else {
            Object.keys(data).forEach((key) => {
                this.defineReactive(data, key);
            });
        }
    }
    // 拦截数据
    defineReactive(data, key) {
        let _value = data[key];
        let dep = new Dep();
        this.walk(_value);
        Object.defineProperty(data, key, {
            set: function (value) {
                if (value === _value) {
                    return;
                }
                _value = value;
                dep.notice();
                return true;
            },
            get: function () {
                if (Dep.target) {
                    dep.addSub(Dep.target);
                }
                return _value;
            },
        });
    }
}




export default Observer;