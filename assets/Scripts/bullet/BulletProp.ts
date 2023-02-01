import { _decorator, Component, Node, Collider, ITriggerEvent } from 'cc';
import { Constant } from '../framework/Constant';
import { GameManager } from '../framework/GameManager';
const { ccclass, property } = _decorator;

@ccclass('BulletProp')
export class BulletProp extends Component {
    private _propZSpeed = 0.3;
    private _propXSpeed = 0.3;
    private _initX = 0;
    private _gameManager: GameManager;

    onEnable() {
        const collider = this.getComponent(Collider);
        collider.on('onTriggerEnter', this._onTriggerEnter, this)
    }

    onDisable() {
        const collider = this.getComponent(Collider);
        collider.off('onTriggerEnter', this._onTriggerEnter, this)
    }


    start() {
        this._initX = this.node.position.x;
    }

    update(deltaTime: number) {
        const pos = this.node.position;
        if (Math.abs(this._initX - pos.x) > 15) {
            this._propXSpeed = -this._propXSpeed;
        }
        this.node.setPosition(pos.x + this._propXSpeed, pos.y, pos.z + this._propZSpeed);

        if (this.node.position.z > Constant.BackgroundRange.Bottom) {
            this.node.destroy();
        }
    }

    public setBulletProp(gameManager: GameManager, speed: number) {
        this._gameManager = gameManager;
        this._propXSpeed = speed;
    }

    //collision
    private _onTriggerEnter(event: ITriggerEvent) {
        const name = event.selfCollider.node.name;
        if (name == 'BulletH') {
            this._gameManager.changeBulletType(Constant.BulletPropType.BULLET_H)
        } else if (name == 'BulletS') {
            this._gameManager.changeBulletType(Constant.BulletPropType.BULLET_S)
        } else {
            this._gameManager.changeBulletType(Constant.BulletPropType.BULLET_M)
        }

        this.node.destroy()
    }
}


