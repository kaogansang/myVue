import Vnode

export default {
    isVnode(node) {
        return node instanceof Vnode;
    }
}