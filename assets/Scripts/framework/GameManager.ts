import { _decorator, Component, Node, Prefab, math, Vec3, RigidBodyComponent, macro, Label, Animation, Pool } from 'cc';
import { Bullet } from '../bullet/Bullet';
import { BulletProp } from '../bullet/BulletProp';
import { EnemyPlane } from '../plane/EnemyPlane';
import { Constant } from './Constant';
import { SelfPlane } from '../plane/SelfPlane';
import { AudioManager } from './AudioManager';
import { PoolManager } from './PoolManager';
const { ccclass, property } = _decorator;


@ccclass('GameManager')
export class GameManager extends Component {
    @property(SelfPlane)
    public playerPlane: SelfPlane = null;

    //bullet
    @property(Prefab)
    public bullet01: Prefab = null;
    @property(Prefab)
    public bullet02: Prefab = null
    @property(Prefab)
    public bullet03: Prefab = null
    @property(Prefab)
    public bullet04: Prefab = null
    @property(Prefab)
    public bullet05: Prefab = null
    @property
    public shootTime = 0.3;
    @property(Node)
    public bulletRoot: Node = null;

    //bulletType
    private _bulletType = Constant.BulletPropType.BULLET_M;
    @property(Prefab)
    public bulletPropM: Prefab = null;
    @property(Prefab)
    public bulletPropH: Prefab = null;
    @property(Prefab)
    public bulletPropS: Prefab = null;
    @property
    public bulletPropSpeed = 0.3;

    //enemy
    @property(Prefab)
    public enemy01: Prefab = null;
    @property(Prefab)
    public enemy02: Prefab = null;
    @property
    public createEnemyTime = 1;

    //shoot
    private _currshootTime = 0;
    private _isShooting = false;

    //enemy
    private _currCreateEnemyTime = 0;
    private _combinationInterval = 0;

    //score
    private _score = 0;
    @property(Label)
    public gameScore: Label = null;
    @property(Label)
    public gameOverScore: Label = null;

    //gameState
    public isGameInProcess = false;

    //UI
    @property(Node)
    public gameStartPage: Node = null;
    @property(Node)
    public gamePage: Node = null;
    @property(Node)
    public gameOverPage: Node = null;
    //animation
    @property(Animation)
    public gameOverAnima: Animation = null;

    //audio
    @property(AudioManager)
    public audioEffect: AudioManager = null;

    //effect
    @property(Prefab)
    public enemyExplode: Prefab = null;

    update(deltaTime: number) {
        if (!this.isGameInProcess) {
            return;
        }

        if (this.playerPlane.isDied) {
            this.gameOver();
        }

        //bullet
        this._currshootTime += deltaTime;
        if (this._isShooting && this._currshootTime > this.shootTime) {
            if (this._bulletType === Constant.BulletPropType.BULLET_H) {
                this.createPlayerBulletH();
            } else if (this._bulletType === Constant.BulletPropType.BULLET_S) {
                this.createPlayerBulletS();
            } else {
                this.createPlayerBulletM();
            }
            this.playAudioEffect('bullet' + (this._bulletType % 2 + 1));
            this._currshootTime = 0;
        }

        //enemy
        this._currCreateEnemyTime += deltaTime;
        if (this._combinationInterval % 3 === Constant.EnemyCombination.KIND1) {
            if (this._currCreateEnemyTime > this.createEnemyTime * Constant.EnemyCombinationInterval.CombinationKind1) {
                this.createEnemyPlane_CombianationKind1();
                this._currCreateEnemyTime = 0;
            }
        } else if (this._combinationInterval % 3 === Constant.EnemyCombination.KIND2) {
            if (this._currCreateEnemyTime > this.createEnemyTime * Constant.EnemyCombinationInterval.CombinationKind2) {
                const randomCombination = math.randomRangeInt(1, 6);
                if (randomCombination === 1) {
                    this.createEnemyPlane_CombianationKind2();
                } else {
                    this.createEnemyPlane_CombianationKind1();
                }
                this._currCreateEnemyTime = 0;
            }
        } else if (this._combinationInterval % 3 === Constant.EnemyCombination.KIND3) {
            if (this._currCreateEnemyTime > this.createEnemyTime * Constant.EnemyCombinationInterval.CombinationKind3) {
                const randomCombination = math.randomRangeInt(1, 10);
                if (randomCombination === 4) {
                    this.createEnemyPlane_CombianationKind2();
                } else if (randomCombination === 6) {
                    this.createEnemyPlane_CombianationKind3();
                } else {
                    this.createEnemyPlane_CombianationKind1();
                }
                this._currCreateEnemyTime = 0;
            }
        }
    }


    private _init() {
        this._reset();
        this._currshootTime = this.shootTime;
        this._changePlaneCombination();
    }

    private _reset() {
        //score
        this._score = 0;
        this.gameScore.string = '0';
        //shoot
        this._currshootTime = 0;
        this._isShooting = false;
        //enemy
        this._currCreateEnemyTime = 0;
        this._combinationInterval = 0;
        //bulletType
        this._bulletType = Constant.BulletPropType.BULLET_M;
        //playerPlane
        this.playerPlane.init();
    }

    //bullet
    //-------------------start--------------------------
    public createPlayerBulletM() {
        const bullet = PoolManager.instance.getNode(this.bullet01, this.bulletRoot);
        const pos = this.playerPlane.node.position;
        bullet.setPosition(pos.x, pos.y, pos.z - 7);
        const bulletCmp = bullet.getComponent(Bullet);
        bulletCmp.setBullet(Constant.BulletSpeed.PlayerOne, false);

        const colliderComp = bullet.getComponent(RigidBodyComponent)
        colliderComp.setGroup(Constant.CollisionType.SELF_BULLET);
        colliderComp.setMask(Constant.CollisionType.ENEMY_PLANE | Constant.CollisionType.ENEMY_BULLET);
    }

    public createPlayerBulletH() {
        const pos = this.playerPlane.node.position;
        //left
        const bullet1 = PoolManager.instance.getNode(this.bullet03, this.bulletRoot);
        bullet1.setPosition(pos.x - 3.5, pos.y, pos.z - 7);
        const bulletCmp1 = bullet1.getComponent(Bullet);
        bulletCmp1.setBullet(Constant.BulletSpeed.PlayerOne, false);
        const colliderComp1 = bullet1.getComponent(RigidBodyComponent)
        colliderComp1.setGroup(Constant.CollisionType.SELF_BULLET);
        colliderComp1.setMask(Constant.CollisionType.ENEMY_PLANE | Constant.CollisionType.ENEMY_BULLET);
        //right
        const bullet2 = PoolManager.instance.getNode(this.bullet03, this.bulletRoot);
        bullet2.setPosition(pos.x + 3.5, pos.y, pos.z - 7);
        const bulletCmp2 = bullet2.getComponent(Bullet);
        bulletCmp2.setBullet(Constant.BulletSpeed.PlayerOne, false);
        const colliderComp2 = bullet2.getComponent(RigidBodyComponent)
        colliderComp2.setGroup(Constant.CollisionType.SELF_BULLET);
        colliderComp2.setMask(Constant.CollisionType.ENEMY_PLANE | Constant.CollisionType.ENEMY_BULLET);
    }

    public createPlayerBulletS() {
        const pos = this.playerPlane.node.position;
        //left
        const bullet1 = PoolManager.instance.getNode(this.bullet05, this.bulletRoot);
        bullet1.setPosition(pos.x - 3.5, pos.y, pos.z - 7);
        const bulletCmp1 = bullet1.getComponent(Bullet);
        bulletCmp1.setBullet(Constant.BulletSpeed.PlayerOne, false, Constant.Direction.LEFT);
        const colliderComp1 = bullet1.getComponent(RigidBodyComponent)
        colliderComp1.setGroup(Constant.CollisionType.SELF_BULLET);
        colliderComp1.setMask(Constant.CollisionType.ENEMY_PLANE | Constant.CollisionType.ENEMY_BULLET);
        //middle
        const bullet2 = PoolManager.instance.getNode(this.bullet05, this.bulletRoot);
        bullet2.setPosition(pos.x, pos.y, pos.z - 7);
        const bulletCmp2 = bullet2.getComponent(Bullet);
        bulletCmp2.setBullet(Constant.BulletSpeed.PlayerOne, false);
        const colliderComp2 = bullet2.getComponent(RigidBodyComponent)
        colliderComp2.setGroup(Constant.CollisionType.SELF_BULLET);
        colliderComp2.setMask(Constant.CollisionType.ENEMY_PLANE | Constant.CollisionType.ENEMY_BULLET);
        //right
        const bullet3 = PoolManager.instance.getNode(this.bullet05, this.bulletRoot);
        bullet3.setPosition(pos.x + 3.5, pos.y, pos.z - 7);
        const bulletCmp3 = bullet3.getComponent(Bullet);
        bulletCmp3.setBullet(Constant.BulletSpeed.PlayerOne, false, Constant.Direction.RIGHT);
        const colliderComp3 = bullet3.getComponent(RigidBodyComponent)
        colliderComp3.setGroup(Constant.CollisionType.SELF_BULLET);
        colliderComp3.setMask(Constant.CollisionType.ENEMY_PLANE | Constant.CollisionType.ENEMY_BULLET);
    }


    public createEnemyBullet(targetPos: Vec3) {
        const bullet = PoolManager.instance.getNode(this.bullet02, this.bulletRoot);
        bullet.setPosition(targetPos.x, targetPos.y, targetPos.z + 5);
        const bulletCmp = bullet.getComponent(Bullet);
        bulletCmp.setBullet(Constant.BulletSpeed.EnemyOne, true);

        const colliderComp = bullet.getComponent(RigidBodyComponent)
        colliderComp.setGroup(Constant.CollisionType.ENEMY_BULLET);
        colliderComp.setMask(Constant.CollisionType.SELF_PLANE | Constant.CollisionType.SELF_BULLET);
    }


    public isShooting(value: boolean) {
        this._isShooting = value;
    }

    public changeBulletType(type: number) {
        this._bulletType = type;
    }

    public createBulletProp() {
        const randomProp = math.randomRangeInt(1, 4);
        let prefab: Prefab = null;
        if (randomProp === Constant.BulletPropType.BULLET_H) {
            prefab = this.bulletPropH;
        } else if (randomProp === Constant.BulletPropType.BULLET_S) {
            prefab = this.bulletPropS;
        } else {
            prefab = this.bulletPropM;
        }

        const prop = PoolManager.instance.getNode(prefab, this.node);
        const randomPosX = math.randomRangeInt(Constant.BackgroundRange.Left + 15, Constant.BackgroundRange.Right - 15);
        prop.setPosition(randomPosX, 0, Constant.BackgroundRange.Top);
        const propComp = prop.getComponent(BulletProp);
        propComp.setBulletProp(this, -this.bulletPropSpeed);

    }
    //-------------------end--------------------------






    //enemy
    //-------------------start--------------------------
    private _changePlaneCombination() {
        this.schedule(this._combinationChanged, 10, macro.REPEAT_FOREVER, 1);
    }

    private _combinationChanged() {
        this._combinationInterval++;
        this.createBulletProp();
    }

    private createEnemyPlane_CombianationKind1() {
        const enenmyType = math.randomRangeInt(1, 3);
        let prefab: Prefab = null;
        let speed = 0;
        if (enenmyType == Constant.EnemyType.TYPE1) {
            prefab = this.enemy01;
            speed = Constant.EnemySpeed.one;
        } else {
            prefab = this.enemy02;
            speed = Constant.EnemySpeed.two;
        }

        const enemy = PoolManager.instance.getNode(prefab, this.node);
        const enemyCmpt_EnemyPlane = enemy.getComponent(EnemyPlane);
        enemyCmpt_EnemyPlane.setEnemyPlane(this, speed, true);

        const randomPos = math.randomRangeInt(Constant.BackgroundRange.Left + 3, Constant.BackgroundRange.Right - 3);
        enemy.setPosition(randomPos, 0, Constant.BackgroundRange.Top);
    }

    private createEnemyPlane_CombianationKind2() {
        const enenmyArray = new Array<Node>(5);
        for (let i = 0; i < enenmyArray.length; i++) {
            const eachEnemy = PoolManager.instance.getNode(this.enemy01, this.node);
            enenmyArray[i] = eachEnemy;
            eachEnemy.setPosition(-20 + i * 10, 0, Constant.BackgroundRange.Top);
            const enemyCmpt_EnemyPlane = eachEnemy.getComponent(EnemyPlane);
            enemyCmpt_EnemyPlane.setEnemyPlane(this, Constant.EnemySpeed.one, false);

        }
    }

    private createEnemyPlane_CombianationKind3() {
        const enenmyArray = new Array<Node>(7);

        const posTop = Constant.BackgroundRange.Top;
        const combiantionPos: Array<[number, number, number]> = [
            [-21, 0, posTop - 15],
            [-14, 0, posTop - 10],
            [-7, 0, posTop - 5],
            [0, 0, posTop],
            [7, 0, posTop - 5],
            [14, 0, posTop - 10],
            [21, 0, posTop - 15],
        ]
        for (let i = 0; i < enenmyArray.length; i++) {
            const eachEnemy = PoolManager.instance.getNode(this.enemy02, this.node);
            enenmyArray[i] = eachEnemy;
            eachEnemy.setPosition(combiantionPos[i][0], combiantionPos[i][1], combiantionPos[i][2]);
            const enemyCmpt_EnemyPlane = eachEnemy.getComponent(EnemyPlane);
            enemyCmpt_EnemyPlane.setEnemyPlane(this, Constant.EnemySpeed.two, false);
        }
    }
    //-------------------end--------------------------



    //score
    //-------------------start--------------------------
    public addScore() {
        this._score++;
        this.gameScore.string = this._score.toString();
    }
    //-------------------end--------------------------


    //ui
    //-------------------start--------------------------
    public gameStart() {
        this._init();
        this.isGameInProcess = true;
    }

    public gameOver() {
        this.gameOverPage.active = true;
        this.gamePage.active = false;
        this.isGameInProcess = false;
        this.unschedule(this._combinationChanged);
        this._destoryAll();
        Constant.GameEventTarget.emit('closeInputEvent');
        this.gameOverScore.string = this._score.toString();
        this.gameOverAnima.play();
    }

    public restart() {
        this._init();
        this.isGameInProcess = true;
    }

    public returnMain() {
        this._reset();
        this.isGameInProcess = false;
    }

    private _destoryAll() {
        this.node.removeAllChildren();
        this.bulletRoot.removeAllChildren();
    }

    //-------------------end--------------------------


    //audio
    //-------------------start--------------------------
    public playAudioEffect(name: string) {
        this.audioEffect.play(name);
    }

    //-------------------end--------------------------



    //enemy explode effect
    //-------------------start--------------------------
    public createEnemyExplodeEffect(pos: Vec3) {
        const effect = PoolManager.instance.getNode(this.enemyExplode, this.node);
        effect.setPosition(pos);
    }

    //-------------------end--------------------------

}


