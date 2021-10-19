import Dep from './Dep.js';


// 订阅者
class Watcher {
    constructor(vm, property, callback) {
        this.vm = vm;
        this.property = property;
        this.callback = callback;
        this.value = null;
        // 初始化Watcher，将watcher添加到订阅列表
        this.init();
        // 初始化Dom，将vm中的初始数据显示
        this.run();
    }
    // 执行回调
    run() {
        let val = this.vm.data[this.property];
        let oldVal = this.value;
        if (val !== oldVal) {
            this.value = val;
            this.callback.call(this.vm, val, oldVal);
        }
    }
    // 添加到订阅列表订阅
    init() {
        Dep.target = this;
        this.vm.data[this.property];
        Dep.target = null;
    }
}


export default Watcher;