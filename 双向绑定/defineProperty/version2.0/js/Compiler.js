import Watcher from "./Watcher.js";

// 定义解析器Compiler
class Compiler {
    constructor(el, vm) {
        this.el = el;
        this.vm = vm;
        this.fragment;
        this.createFragment(this.el);
        this.dfs(this.fragment);
        this.el.appendChild(this.fragment);
    }
    // 将目标节点添加到fragment中，fragment在内存中，Dom操作更高效
    createFragment() {
        this.fragment = document.createDocumentFragment();
        let nodes = this.el.childNodes;
        [].slice.call(nodes).forEach((node) => {
            this.fragment.appendChild(node);
        });
    }
    // 深度优先遍历节点
    dfs(node) {
        let childs = node.childNodes;
        if (childs.length) {
            // 递归遍历
            [].slice.call(childs).forEach((child) => {
                this.dfs(child);
            });
        } else {
            //文本和输入都必然是叶子节点
            this.compileElement(node);
        }
    }
    // 解析节点
    compileElement(node) {
        // 文本节点
        if (node.nodeType == 3) {
            this.compileText(node);
        }
        // 非文本节点
        else {
            this.compileAttr(node);
        }
    }
    // 解析文本中的‘{{}}’
    compileText(node) {
        let rule = /\{\{(.*?)\}\}/;
        let text = node.textContent;
        if (rule.test(text)) {
            new Watcher(this.vm, rule.exec(text)[1], (val) => {
                node.textContent = val;
            });
        }
    }
    // 检测v-module属性
    compileAttr(node) {
        let targetTags = ["INPUT", "TEXTAREA"];
        if (targetTags.includes(node.tagName)) {
            let atts = node.attributes;
            let vModelVal = atts["v-model"]?.value;
            if (vModelVal) {
                node.addEventListener("input", (e) => {
                    this.vm.data[vModelVal] = e.target.value;
                });
            }
        }
    }
}

export default Compiler;
