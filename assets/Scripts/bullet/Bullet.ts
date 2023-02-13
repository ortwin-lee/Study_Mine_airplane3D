import { _decorator, Component, ITriggerEvent, Collider } from 'cc';
const { ccclass } = _decorator;

import { Constant } from '../framework/Constant'
import { PoolManager } from '../framework/PoolManager';


@ccclass('Bullet')
export class Bullet extends Component {
    private _speed = 0;
    private _direction = Constant.Direction.MIDDLE;
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

        if (this._isEnemyBullet) {
            this.node.setPosition(pos.x, pos.y, moveLength)
            if (moveLength > Constant.BackgroundRange.Bottom) {
                PoolManager.instance.putNode(this.node);
            }
        } else {
            if (this._direction === Constant.Direction.LEFT) {
                this.node.setPosition(pos.x - Constant.BulletSpeed.XOffset, pos.y, moveLength)
            } else if (this._direction === Constant.Direction.RIGHT) {
                this.node.setPosition(pos.x + Constant.BulletSpeed.XOffset, pos.y, moveLength)
            } else {
                this.node.setPosition(pos.x, pos.y, moveLength)
            }

            if (moveLength < Constant.BackgroundRange.Top) {
                PoolManager.instance.putNode(this.node);
            }
        }

    }

    public setBullet(speed: number, isEnemyBullet: boolean, direction: number = Constant.Direction.MIDDLE) {
        this._speed = speed;
        this._direction = direction;
        this._isEnemyBullet = isEnemyBullet;
    }

    //collision
    private _onTriggerEnter(event: ITriggerEvent) {
        const collisionGroup = event.otherCollider.getGroup()
        if (collisionGroup == Constant.CollisionType.SELF_PLANE || collisionGroup == Constant.CollisionType.SELF_BULLET) {
            PoolManager.instance.putNode(this.node);
        }
    }
}


