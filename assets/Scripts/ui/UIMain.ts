import { _decorator, Component, Node, input, Input, EventTouch } from 'cc';
import { GameManager } from '../framework/GameManager';
const { ccclass, property } = _decorator;

@ccclass('UIMain')
export class UIMain extends Component {
    @property
    public planeSpeed = 1;

    @property(Node)
    public playerPlane: Node = null;

    @property(GameManager)
    public gameManager: GameManager = null;

    start() {
        input.on(Input.EventType.TOUCH_START, this._touchStart, this);
        input.on(Input.EventType.TOUCH_END, this._touchEnd, this);
        input.on(Input.EventType.TOUCH_MOVE, this._touchMove, this);
    }

    // update(deltaTime: number) {

    // }

    _touchStart(event: EventTouch) {
        this.gameManager.isShooting(true);
    }

    _touchEnd(event: EventTouch) {
        this.gameManager.isShooting(false);
    }

    _touchMove(event: EventTouch) {
        const delta = event.touch.getDelta();
        let pos = this.playerPlane.position;
        this.playerPlane.setPosition(pos.x + 0.1 * this.planeSpeed * delta.x, pos.y, pos.z - 0.1 * this.planeSpeed * delta.y);
    }
}


