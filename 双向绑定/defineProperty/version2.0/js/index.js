import Compiler from "./Compiler.js";
import Observer from "./Observer.js";

// 定义Vue类
class MyVue {
    constructor(options) {
        this.data = options.data;
        // 代理data
        this._dataProxy();
        // 添加监视器
        // observer(this.data);
        new Observer(this.data);
        new Compiler(options.el, this);
    }
    // 将this.data代理到this,使得mv.data.prop === mv.prop
    _dataProxy() {
        Object.keys(this.data).forEach((key) => {
            Object.defineProperty(this, key, {
                get: () => {
                    return this.data[key];
                },
                set: (value) => {
                    this.data[key] = value;
                    return true;
                },
            });
        });
    }
}

export default MyVue;
