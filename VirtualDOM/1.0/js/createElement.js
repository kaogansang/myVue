class Element {
    constructor(tagName, attrs, childs) {
        this.tagName = tagName;
        this.attrs = attrs || {};
        this.key = attrs.key || null;
        if (typeof childs === "string") {
            this.text = childs;
            this.type = 'TEXT'
        } else {
            this.childs = childs;
            this.type = 'ELEMENT_NODE'
        }
        this.el = null;
    }
    filteTextChild() {
        this.childs.forEach((child, i) => {
            // 如果child不为Element对象，就转化为字符串
            if (!(child instanceof Element)) {
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
                let childElement =
                    child instanceof Element
                        ? child.render()
                        : document.createTextNode(child);
                this.el.appendChild(childElement);
            });
        }
        // 有文本
        if (typeof text === "string") {
            let childElement = document.createTextNode(text);
            this.el.appendChild(childElement);
        }
        return this.el;
    }
}

function createElement(tagName, attrs, childs) {
    return new Element(tagName, attrs, childs);
}

export default {
    Element,
    createElement,
};
