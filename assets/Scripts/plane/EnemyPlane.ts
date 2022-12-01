import { _decorator, Component, Node, sp } from 'cc';
const { ccclass, property } = _decorator;
import { Constant } from '../framework/Constant'

@ccclass('EnemyPlane')
export class EnemyPlane extends Component {
    private _enemySpeed = 0;

    // public enemyType = Constant.EnemyType.TYPE1;

    start() {

    }

    update(deltaTime: number) {
        const pos = this.node.position;
        const moveLength = pos.z + this._enemySpeed;
        this.node.setPosition(pos.x, pos.y, moveLength)

        if (moveLength > Constant.BackgroundRange.Bottom) {
            this.node.destroy();
            console.log(`${this.node.name} destroy`);
        }
    }

    //speed
    set speed(speed: number) {
        this._enemySpeed = speed;
    }
}


