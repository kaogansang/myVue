let data = {};

let viewList = document.querySelectorAll("[v-module]");
viewList.forEach((viewNode) => {
    let name = viewNode.getAttribute("v-module");
    if (!Object.hasOwn(data, name)) {
        let watchers = [];
        viewList.forEach((item) => {
            if (item.getAttribute("v-module") === name) watchers.push(item);
        });
        Object.defineProperty(data, name, {
            _value: "",
            set: (value) => {
                watchers.forEach((watcher) => {
                    watcher.value = value;
                });
            },
            get: () => {
                return this._value;
            },
        });
    }


    // 监听视图更新
    viewNode.addEventListener("input", () => {
        data[name] = viewNode.value;
    });
});
