import { _decorator, Component, Node, input, Input, EventTouch, EventTarget } from 'cc';
import { GameManager } from '../framework/GameManager';
import { Constant } from '../framework/Constant';
const { ccclass, property } = _decorator;

@ccclass('UIMain')
export class UIMain extends Component {
    @property
    public planeSpeed = 1;

    @property(Node)
    public playerPlane: Node = null;

    @property(GameManager)
    public gameManager: GameManager = null;

    @property(Node)
    public gameStart: Node = null;

    @property(Node)
    public game: Node = null;

    @property(Node)
    public gameOver: Node = null;

    onLoad() {
        this.gameStart.active = true;
        input.on(Input.EventType.TOUCH_START, this._gameTouchStart, this);
    }

    private _touchStart(event: EventTouch) {
        this.gameManager.isShooting(true);
    }

    private _touchEnd(event: EventTouch) {
        this.gameManager.isShooting(false);
    }

    private _touchMove(event: EventTouch) {
        const delta = event.touch.getDelta();
        let pos = this.playerPlane.position;
        this.playerPlane.setPosition(pos.x + 0.1 * this.planeSpeed * delta.x, pos.y, pos.z - 0.1 * this.planeSpeed * delta.y);
    }


    public _gameTouchStart(event: EventTouch) {
        input.off(Input.EventType.TOUCH_START, this._gameTouchStart, this);
        this.gameStartCall();
    }

    public gameStartCall() {
        this.gameStart.active = false;
        this.game.active = true;
        this._openInputEvent();
        this.gameManager.gameStart();
        Constant.GameEventTarget.once('closeInputEvent', this._closeInputEvent, this);
        this.playerPlane.setPosition(0, 0, 30);
    }

    public gameRestartCall() {
        this.gameOver.active = false;
        this.game.active = true;
        this.gameManager.playAudioEffect('button');
        this._openInputEvent();
        this.gameManager.restart();
        Constant.GameEventTarget.once('closeInputEvent', this._closeInputEvent, this);
        this.playerPlane.setPosition(0, 0, 30);
    }

    public gameReturnMainCall() {
        this.gameOver.active = false;
        this.gameStart.active = true;
        this.gameManager.playAudioEffect('button');
        this.gameManager.returnMain();
        input.on(Input.EventType.TOUCH_START, this._gameTouchStart, this);
        this.playerPlane.setPosition(0, 0, 30);
    }


    private _openInputEvent() {
        input.on(Input.EventType.TOUCH_START, this._touchStart, this);
        input.on(Input.EventType.TOUCH_END, this._touchEnd, this);
        input.on(Input.EventType.TOUCH_MOVE, this._touchMove, this);
    }

    private _closeInputEvent() {
        input.off(Input.EventType.TOUCH_START, this._touchStart, this);
        input.off(Input.EventType.TOUCH_END, this._touchEnd, this);
        input.off(Input.EventType.TOUCH_MOVE, this._touchMove, this);
    }

}


