// 消息订阅器
class Dep {
    // 用于标记即将添加的订阅者
    static target = null;
    // 订阅者列表
    subs = [];
    // 添加订阅者
    addSub(sub) {
        this.subs.push(sub);
    }
    // 通知订阅者
    notice() {
        this.subs.forEach((sub) => {
            sub.run();
        });
    }
}


export default Dep;