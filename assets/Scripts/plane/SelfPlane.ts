import { _decorator, Component, __private, Collider, ITriggerEvent, Node, AudioSource } from 'cc';
import { Constant } from '../framework/Constant';
const { ccclass, property } = _decorator;

@ccclass('SelfPlane')
export class SelfPlane extends Component {
    @property(Node)
    public explode: Node = null;
    @property(Node)
    public blood: Node = null;
    @property(Node)
    public surfaceAnchor: Node = null;

    public lifeValue = 5;
    private _currlife = 0;
    public isDied:Boolean = false;

    private _audioSource: AudioSource = null;

    onEnable() {
        this._audioSource = this.getComponent(AudioSource);
        const collider = this.getComponent(Collider);
        collider.on('onTriggerEnter', this._onTriggerEnter, this)
    }

    onDisable() {
        const collider = this.getComponent(Collider);
        collider.off('onTriggerEnter', this._onTriggerEnter, this)
    }

    public init() {
        this._currlife = this.lifeValue;
        this.isDied = false;
        this.explode.active = false;
        this.surfaceAnchor.setScale(1, 1, 1)
    }

    //collision
    private _onTriggerEnter(event: ITriggerEvent) {
        const collisionGroup = event.otherCollider.getGroup()
        if(collisionGroup === Constant.CollisionType.ENEMY_PLANE || collisionGroup === Constant.CollisionType.ENEMY_BULLET)
        {
            if(this._currlife === this.lifeValue) {
                this.blood.active = true;
            }
            this._currlife--;
            this.surfaceAnchor.setScale(this._currlife / this.lifeValue, 1, 1)
            if(this._currlife <= 0){
                this.isDied = true;
                this._audioSource.play()
                this.explode.active = true;
                this.blood.active = false;
                console.log('your plane is died!');
            }
        }
    }

}


