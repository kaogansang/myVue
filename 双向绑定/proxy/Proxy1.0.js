let data = {};

let proxy = new Proxy(data, {
    set: (obj, key, value) => {
        m2v(key, value);
        obj[key] = value;
        return true;
    },
    get: (obj, key) => {
        return obj[key];
    },
});


v2m();


// 视图view 到  模型module
function v2m() {
    document.querySelectorAll(`[v-module]`).forEach((node) => {
        node.addEventListener("input", () => {
            let name = node.getAttribute("v-module");
            proxy[name] = node.value;
        });
    });
}


// 模型module  到  视图view
function m2v(key, value) {
    let watchers = document.querySelectorAll(`[v-module]`);
    watchers.forEach((item) => {
        if (item.getAttribute("v-module") === key) {
            item.value = value;
        }
    });
}
