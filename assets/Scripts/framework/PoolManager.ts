import { _decorator, instantiate, Node, NodePool, Prefab } from 'cc';
const { ccclass } = _decorator;

interface IDictPool {
    [name: string]: NodePool;
}

@ccclass('PoolManager')
export class PoolManager {

    private _dictPool: IDictPool = {};

    public static readonly instance = new PoolManager();

    public getNode(prefab: Prefab, parent: Node) {
        const name = prefab.data.name;
        let node: Node = null;

        let pool: NodePool = this._dictPool[name];
        if (pool) {
            node = pool.get();
            if (!node) {
                node = instantiate(prefab);
                pool.put(node);
            }
        } else {
            node = instantiate(prefab);
            pool = new NodePool();
            pool.put(node);
            this._dictPool[name] = pool;
        }

        node.setParent(parent);
        node.active = true;
        return node;
    }

    public putNode(node:Node) {
        node.parent = null;
        const name = node.name;
        if (!this._dictPool[name]) {
            this._dictPool[name] = new NodePool();
        }

        this._dictPool[name].put(node);
    }
}


