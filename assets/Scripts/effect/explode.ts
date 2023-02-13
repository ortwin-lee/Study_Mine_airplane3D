import { _decorator, Component } from 'cc';
import { PoolManager } from '../framework/PoolManager';
const { ccclass } = _decorator;

@ccclass('explode')
export class explode extends Component {
    onEnable() {
        this.scheduleOnce(()=>{
            PoolManager.instance.putNode(this.node);
        }, 2);
    }
}


