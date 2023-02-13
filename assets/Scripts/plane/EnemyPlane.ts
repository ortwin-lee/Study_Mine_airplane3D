import { _decorator, Component, ITriggerEvent, Collider } from 'cc';
const { ccclass, property } = _decorator;
import { Constant } from '../framework/Constant'
import { GameManager } from '../framework/GameManager';
import { PoolManager } from '../framework/PoolManager';

@ccclass('EnemyPlane')
export class EnemyPlane extends Component {
    @property
    public createBulletTime = 0.5;

    private _enemySpeed = 0;
    private _needBullet = false;

    private _gameManager: GameManager = null;

    private _currCreateBulletTime = 0;


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
        const moveLength = pos.z + this._enemySpeed;
        this.node.setPosition(pos.x, pos.y, moveLength)

        if(this._needBullet) {
            this._currCreateBulletTime += deltaTime;
            if(this._currCreateBulletTime > this.createBulletTime) {
                this._gameManager.createEnemyBullet(this.node.position);
                this._currCreateBulletTime = 0;
            }
        }


        if (moveLength > Constant.BackgroundRange.Bottom) {
            PoolManager.instance.putNode(this.node);
        }
    }

    //speed and bullet
    public setEnemyPlane(gameManager: GameManager, speed: number, needBullet: boolean) {
        this._gameManager = gameManager;
        this._enemySpeed = speed;
        this._needBullet = needBullet;
    }

    //collision
    private _onTriggerEnter(event: ITriggerEvent) {
        const collisionGroup = event.otherCollider.getGroup()
        if(collisionGroup == Constant.CollisionType.SELF_PLANE || collisionGroup == Constant.CollisionType.SELF_BULLET)
        {
            this._gameManager.createEnemyExplodeEffect(this.node.position);
            this._gameManager.addScore();
            this._gameManager.playAudioEffect('enemy');
            PoolManager.instance.putNode(this.node);

        }
    }
}


