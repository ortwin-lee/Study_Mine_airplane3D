import { _decorator, Component, ITriggerEvent, Collider } from 'cc';
const { ccclass } = _decorator;

import { Constant } from '../framework/Constant'


@ccclass('Bullet')
export class Bullet extends Component {
    private _speed = 0;
    private _isEnemyBullet = false;


    onEnable() {
        const collider = this.getComponent(Collider);
        collider.on('onTriggerEnter', this._onTriggerEnter, this)
    }

    onDisable() {
        const collider = this.getComponent(Collider);
        collider.off('onTriggerEnter', this._onTriggerEnter, this)
    }

    start() {

    }

    update(deltaTime: number) {
        const pos = this.node.position;
        const moveLength = pos.z + this._speed;
        this.node.setPosition(pos.x, pos.y, moveLength)

        if(this._isEnemyBullet) {
            if (moveLength > Constant.BackgroundRange.Bottom) {
                this.node.destroy();
            }
        } else {
            if (moveLength < Constant.BackgroundRange.Top) {
                this.node.destroy();
            }
        }

    }

    public setBullet(speed: number, isEnemyBullet: boolean) {

        this._speed = speed;
        this._isEnemyBullet = isEnemyBullet;
    }

    //collision
    private _onTriggerEnter(event: ITriggerEvent) {
        const collisionGroup = event.otherCollider.getGroup()
        if(collisionGroup == Constant.CollisionType.SELF_PLANE || collisionGroup == Constant.CollisionType.SELF_BULLET)
        {
            this.node.destroy();
        }
    }
}


