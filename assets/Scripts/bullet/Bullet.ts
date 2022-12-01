import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

import { Constant } from '../framework/Constant'


@ccclass('Bullet')
export class Bullet extends Component {
    @property
    public bulletSpeed = 0;

    start() {

    }

    update(deltaTime: number) {
        const pos = this.node.position;
        const moveLength = pos.z + this.bulletSpeed;
        this.node.setPosition(pos.x, pos.y, moveLength)

        if(moveLength > Constant.BackgroundRange.Bottom) {
            this.node.destroy();
            console.log('bullet destroy');

        }

    }
}


