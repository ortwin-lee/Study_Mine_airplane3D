import { _decorator, Component } from 'cc';
const { ccclass } = _decorator;

import { Constant } from '../framework/Constant'


@ccclass('Bullet')
export class Bullet extends Component {
    private _speed = 0;
    private _isEnemyBullet = false;


    start() {

    }

    update(deltaTime: number) {
        const pos = this.node.position;
        const moveLength = pos.z + this._speed;
        this.node.setPosition(pos.x, pos.y, moveLength)

        if(this._isEnemyBullet) {
            if (moveLength > Constant.BackgroundRange.Bottom) {
                this.node.destroy();
                console.log('Enemy bullet destroy');
            }
        } else {
            if (moveLength < Constant.BackgroundRange.Top) {
                this.node.destroy();
                console.log('player bullet destroy');
            }
        }

    }

    public setBullet(speed: number, isEnemyBullet: boolean) {

        this._speed = speed;
        this._isEnemyBullet = isEnemyBullet;
    }
}


