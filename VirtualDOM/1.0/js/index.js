// 工具对象
let t = {
    // 判断定义
    isDef(p) {
        return p !== undefined && p !== null;
    },
    // 判断字符串
    isStr(p) {
        return typeof p === "string";
    },
    // 判断Vnode实例
    isVnode(vnode) {
        return vnode instanceof Vnode;
    },
    // 比较Vnode
    isSameVnode(vn1, vn2) {
        return (
            vn1.key === vn2.key &&
            vn1.type == vn2.type &&
            vn1.tagName === vn2.tagName
        );
    },
    // 获得DOM节点标签类型
    getTag(el) {
        return el?.tagName;
    },
    // DOM插入节点
    insertBefore(parentEl, newEl, oldEl) {
        if (!oldEl) return parentEl.appendChild(newEl);
        return parentEl.insertBefore(newEl, oldEl);
    },
    // 删除Vnode节点
    removeVnode(vnode) {
        let el = vnode.el;
        let parentEl = el.parentNode;
        return parentEl.removeChild(el);
    },
    // 设置DOM节点textContent
    setTextContent(node, text) {
        return (node.textContent = text);
    },
    // 给DOM节点添加Vnode孩子
    addChilds(el, vnode, stargIndex, endIndex) {
        for (let i = stargIndex; i <= endIndex; i++) {
            let child = vnode.childs[i];
            let childEl = t.isStr(child)
                ? document.createTextNode(child)
                : child.render();
            el.appendChild(childEl);
        }
        return el;
    },
    // 返回{key：inde}的Map实例
    getKeyMap(childs, start = 0, end = childs.length - 1) {
        // start = start || 0;
        // end = end || childs.length - 1;
        let map = new Map();
        for (let i = start; i <= end; i++) {
            let key = childs[i].key;
            // if (map.has(key)) throw `请勿设置相同key！！！${child}`;
            map.set(key, i);
        }
        return map;
    },
    // 获取下一个兄弟节点
    nextSibling(el) {
        return el.nextSibling;
    }
};

class Vnode {
    constructor(tagName, attrs, childs, el, parent) {
        this.tagName = tagName;
        this.attrs = attrs || {};
        this.key = attrs.key || null;
        this.el = el;
        this.parent = parent;
        if (t.isStr(childs)) {
            this.text = childs;
            this.type = "TEXT";
        } else {
            this.childs = childs;
            this.type = "ELEMENT_NODE";
        }
    }
    filteTextChild() {
        this.childs.forEach((child, i) => {
            // 如果child不为Vnode对象，就转化为字符串
            if (!t.isVnode(child)) {
                this.childs[i] = "" + child;
            }
        });
    }
    render() {
        let attrs = this.attrs;
        let childs = this.childs;
        let text = this.text;
        this.el = document.createElement(this.tagName);
        for (let key in attrs) {
            this.el.setAttribute(key, attrs[key]);
        }
        // 有子节点
        if (Array.isArray(childs)) {
            this.childs.forEach((child) => {
                let childElement = t.isVnode(child)
                    ? child.render()
                    : document.createTextNode(child);
                this.el.appendChild(childElement);
            });
        }
        // 有文本
        if (t.isStr(text)) {
            let childElement = document.createTextNode(text);
            this.el.appendChild(childElement);
        }
        return this.el;
    }
}

function createVnode(tagName, attrs, childs) {
    return new Vnode(tagName, attrs, childs);
}

// 根据真实dom构造一个vnode
function emptyNodeAt(el) {
    return new Element(t.getTag(el), {}, [], el);
}

function patch(oldVnode, newVnode) {
    if (t.isSameVnode(oldVnode, newVnode)) {
        patchNode(oldVnode, newVnode);
    } else {
        newVnode.render();
        t.insertBefore(oldVnode.el.parentNode, newVnode.el, oldVnode.el);
        t.removeVnode(oldVnode);
    }
}

function patchNode(oldVnode, newVnode) {
    let el = oldVnode.el;
    newVnode.el = el;
    // 新节点是文本节点
    if (t.isDef(newVnode.text)) {
        let text = newVnode.text;
        t.setTextContent(el, text);
    }
    // 新节点非文本节点
    else {
        // 新旧节点都有childs
        if (t.isDef(oldVnode.childs) && t.isDef(newVnode.childs)) {
            diffWalk(oldVnode, newVnode);
        }
        // 旧节点 有childs，新节点 无childs
        else if (t.isDef(oldVnode.childs)) {
            t.setTextContent(el, "");
        }
        // 新节点 有childs，旧节点 无childs
        else if (t.isDef(newVnode.childs)) {
            t.addChilds(el, newVnode, 0, newVnode.childs.length - 1);
        }
        // 新旧节点都没有childs
        else {
            t.setTextContent(el, "");
        }
    }
}

function diffWalk(oldVnode, newVnode) {
    let el = oldVnode.el;
    let oldCh = oldVnode.childs;
    let newCh = newVnode.childs;
    let oldStartIndex = 0;
    let oldEndIndex = oldCh.length - 1;
    let newStartIndex = 0;
    let newEndIndex = newCh.length - 1;
    let oldStartCh = oldCh[oldStartIndex];
    let oldEndCh = oldCh[oldEndIndex];
    let newStartCh = newCh[newStartIndex];
    let newEndCh = newCh[newEndIndex];
    let keyMap;

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        // 旧头去空
        if (!t.isDef(oldCh[oldStartIndex])) {
            oldStartCh = oldCh[++oldStartIndex];
        }
        // 旧尾去空
        else if (!t.isDef(oldCh[oldEndIndex])) {
            oldEndCh = oldCh[--oldEndIndex];
        }
        // 头相同
        else if (t.isSameVnode(oldStartCh, newStartCh)) {
            patchNode(oldStartCh, newStartCh);
            oldStartCh = oldCh[++oldStartIndex];
            newStartCh = newCh[++newStartIndex];
        }
        // 尾相同
        else if (t.isSameVnode(oldEndCh, newEndCh)) {
            patchNode(oldEndCh, newEndCh);
            oldEndCh = oldCh[--oldEndIndex];
            newEndCh = newCh[--newEndIndex];
        }
        // 旧头新尾
        else if (t.isSameVnode(oldStartCh, newEndCh)) {
            patchNode(oldStartCh, newEndCh);
            t.insertBefore(el, newEndCh.el, nextSibling(oldEndCh.el));
            oldStartCh = oldCh[++oldStartIndex];
            newEndCh = newCh[--newEndIndex];
        }
        // 旧尾新头
        else if (t.isSameVnode(oldEndCh, newStartCh)) {
            patchNode(oldEndCh, newStartCh);
            t.insertBefore(el, newStartCh.el, oldStartCh.el);
            oldEndCh = oldCh[--oldEndIndex];
            newStartCh = newCh[++newStartIndex];
        }
        // 首尾都不同
        else {
            let newStartKey = newStartCh.key;
            keyMap = keyMap || t.getKeyMap(oldCh, oldStartIndex, oldEndIndex);
            let keyIndex = t.isDef(newStartKey) && keyMap.get(newStartKey);
            let matchVnode = t.isDef(keyIndex) && oldCh[keyIndex];
            // 有相同节点
            if (matchVnode) {
                patchNode(matchVnode, newStartCh);
                oldCh[keyIndex] = undefined;
            }
            // 无相同节点
            else {
                newStartCh.render();
            }
            t.insertBefore(el, newStartCh.el, oldStartCh.el);
            newStartCh = newCh[++newStartIndex];
        }
    }
    while (oldStartIndex <= oldEndIndex) {
        t.removeVnode(oldStartCh);
        oldStartCh = oldCh[++oldStartIndex];
    }
    while (newStartIndex <= newEndIndex) {
        newStartCh.render();
        t.insertBefore(el, newStartCh.el, oldStartCh.el);
        newStartCh = newCh[++newStartIndex];
    }
}

/* --------------------------------TEST----------------------------------------- */
var el = createVnode;
var ul = el("div", { id: "virtual-dom", key: 1 }, [
    el("p", {}, "Virtual DOM"),
    el("ul", { id: "list" }, [
        el("li", { class: "item", key: 25 }, "Item 25"),//4
        el("li", { class: "item", key: 2 }, "Item 2"), //1
        el("li", { class: "item", key: 4 }, "Item 4"), //3
        el("li", { class: "item", key: 28 }, "Item 28"), //2
    ]),
    el("div", {}, "Hello World"),
]);
ul.render();
var ul2 = el("div", { id: "virtual-dom2", key: 1 }, [
    el("p", {}, "Virtual DOM2"),
    el("ul", { id: "list2" }, [
        el("li", { class: "item", key: 2 }, "Item 2/"), //1
        el("li", { class: "item", key: 28 }, "Item 28/"), //2
        el("li", { class: "item", key: 3 }, "Item 3/"),//5
        el("li", { class: "item", key: 25 }, "Item 25/"),//4
        el("li", { class: "item", key: 4 }, "Item 4/"), //3
    ]),
    el("div", {}, "Hello World"),
]);


document.body.appendChild(ul.el);

document.getElementById("btn").onclick = () => {
    patch(ul, ul2);
};
