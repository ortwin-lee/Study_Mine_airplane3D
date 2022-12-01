import { _decorator, Component, Node, Prefab, instantiate, math } from 'cc';
import { Bullet } from '../bullet/Bullet';
import { EnemyPlane } from '../plane/EnemyPlane';
import { Constant } from './Constant';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {
    @property(Node)
    public playerPlane: Node = null;

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
    @property


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


    start() {
        this._init();
    }

    update(deltaTime: number) {
        //bullet
        this._currshootTime += deltaTime;
        if (this._isShooting && this._currshootTime > this.shootTime) {
            this.createPlayerBullet();
            this._currshootTime = 0;
        }

        //enemy
        this._currCreateEnemyTime += deltaTime;
        if (this._combinationInterval === Constant.EnemyCombination.KIND1) {
            if (this._currCreateEnemyTime > this.createEnemyTime * Constant.EnemyCombinationInterval.CombinationKind1) {
                this.createEnemyPlane_CombianationKind1();
                this._currCreateEnemyTime = 0;
            }
        } else if (this._combinationInterval === Constant.EnemyCombination.KIND2) {
            if (this._currCreateEnemyTime > this.createEnemyTime * Constant.EnemyCombinationInterval.CombinationKind2) {
                const randomCombination = math.randomRangeInt(1, 6);
                if(randomCombination === 1) {
                    this.createEnemyPlane_CombianationKind2();
                } else {
                    this.createEnemyPlane_CombianationKind1();
                }
                this._currCreateEnemyTime = 0;
            }
        } else if (this._combinationInterval === Constant.EnemyCombination.KIND3) {
            if (this._currCreateEnemyTime > this.createEnemyTime * Constant.EnemyCombinationInterval.CombinationKind3) {
                const randomCombination = math.randomRangeInt(1, 10);
                console.log(randomCombination);
                if(randomCombination === 4) {
                    this.createEnemyPlane_CombianationKind2();
                } else if (randomCombination === 6) {
                    this.createEnemyPlane_CombianationKind3();
                }else {
                    this.createEnemyPlane_CombianationKind1();
                }
                this._currCreateEnemyTime = 0;
            }
        }
    }


    private _init() {
        this._currshootTime = this.shootTime;
        this._changePlaneCombination();
    }


    //bullet
    public createPlayerBullet() {
        const bullet = instantiate(this.bullet01);
        bullet.setParent(this.bulletRoot);
        const pos = this.playerPlane.position;
        bullet.setPosition(pos.x, pos.y, pos.z - 7);
        const bulletCmp = bullet.getComponent(Bullet);
        bulletCmp.bulletSpeed = Constant.BulletSpeed.one;
    }

    public isShooting(value: boolean) {
        this._isShooting = value;
    }



    //enemy
    private _changePlaneCombination() {
        this.schedule(this._combinationChanged, 10, 2, 1);
    }

    private _combinationChanged() {
        this._combinationInterval++;
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

        const enemy = instantiate(prefab);
        enemy.setParent(this.node);
        const enemyCmpt_EnemyPlane = enemy.getComponent(EnemyPlane);
        enemyCmpt_EnemyPlane.speed = speed;

        const randomPos = math.randomRangeInt(Constant.BackgroundRange.Left + 3, Constant.BackgroundRange.Right - 3);
        enemy.setPosition(randomPos, 0, Constant.BackgroundRange.Top);
    }

    private createEnemyPlane_CombianationKind2() {
        const enenmyArray = new Array<Node>(5);
        for(let i = 0; i <enenmyArray.length; i++) {
            enenmyArray[i] = instantiate(this.enemy01);
            const eachEnemy = enenmyArray[i];
            eachEnemy.parent = this.node;
            eachEnemy.setPosition(-20 + i * 10, 0, Constant.BackgroundRange.Top);
            const enemyCmpt_EnemyPlane = eachEnemy.getComponent(EnemyPlane);
            enemyCmpt_EnemyPlane.speed = Constant.EnemySpeed.one;
        }
    }

    private createEnemyPlane_CombianationKind3() {
        const enenmyArray = new Array<Node>(7);

        const posTop = Constant.BackgroundRange.Top;
        const combiantionPos = [
            [-21, 0 , posTop-15],
            [-14, 0 , posTop-10],
            [-7, 0 , posTop-5],
            [0,0,posTop],
            [7, 0 , posTop-5],
            [14, 0 , posTop-10],
            [21, 0 , posTop-15],
        ]
        for(let i = 0; i <enenmyArray.length; i++) {
            enenmyArray[i] = instantiate(this.enemy02);
            const eachEnemy = enenmyArray[i];
            eachEnemy.parent = this.node;
            eachEnemy.setPosition(combiantionPos[i][0], combiantionPos[i][1], combiantionPos[i][2]);
            const enemyCmpt_EnemyPlane = eachEnemy.getComponent(EnemyPlane);
            enemyCmpt_EnemyPlane.speed = Constant.EnemySpeed.two;
        }
    }
}


